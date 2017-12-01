
#include "nan.h"
#include <windows.h>
#include <stdio.h>
#include <tchar.h>

using namespace Nan;
using namespace v8;

#define UNICODE

#define MAX_KEY_LENGTH 255
#define MAX_VALUE_NAME 16383

namespace {

v8::Local<v8::Object> CreateEntry(TCHAR *name, TCHAR *type, char *data) {
  auto obj = Nan::New<v8::Object>();
  obj->Set(Nan::New("name").ToLocalChecked(), Nan::New(name).ToLocalChecked());
  obj->Set(Nan::New("type").ToLocalChecked(), Nan::New(type).ToLocalChecked());
  obj->Set(Nan::New("data").ToLocalChecked(), Nan::New<v8::String>(data).ToLocalChecked());
  return obj;
}

v8::Local<v8::Object> CreateEntry(TCHAR *name, TCHAR *type, DWORD data) {
  auto obj = Nan::New<v8::Object>();
  obj->Set(Nan::New("name").ToLocalChecked(), Nan::New(name).ToLocalChecked());
  obj->Set(Nan::New("type").ToLocalChecked(), Nan::New(type).ToLocalChecked());
  obj->Set(Nan::New("data").ToLocalChecked(), Nan::New((INT32)data));
  return obj;
}

NAN_METHOD(ReadValues) {
  if (info.Length() < 2) {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsNumber()) {
    Nan::ThrowTypeError("A number was expected for the first argument, but wasn't received.");
    return;
  }

  if (!info[1]->IsString()) {
    Nan::ThrowTypeError("A string was expected for the second argument, but wasn't received.");
    return;
  }

  ULONG first = info[0]->NumberValue();
  auto second = *v8::String::Utf8Value(info[1]);

  HKEY hCurrentKey;
  LONG openKey;

  openKey = RegOpenKeyEx(
    (HKEY)first,
    second,
    0,
    KEY_READ | KEY_WOW64_64KEY,
    &hCurrentKey);

  if (openKey != ERROR_SUCCESS) {
    char* errorMessage = NULL;
    sprintf(errorMessage, "RegOpenKeyEx failed - exit code: '%d'", openKey);
    Nan::ThrowTypeError(errorMessage);
    return;
  }

  TCHAR achClass[MAX_PATH] = TEXT("");  // buffer for class name
  DWORD cchClassName = MAX_PATH;        // size of class string
  DWORD cSubKeys = 0;                   // number of subkeys
  DWORD cbMaxSubKey;                    // longest subkey size
  DWORD cchMaxClass;                    // longest class string
  DWORD cValues;                        // number of values for key
  DWORD cchMaxValue;                    // longest value name
  DWORD cbMaxValueData;                 // longest value data

  TCHAR achValue[MAX_VALUE_NAME];
  DWORD cchValue = MAX_VALUE_NAME;

  auto retCode = RegQueryInfoKey(
    hCurrentKey,
    achClass,
    &cchClassName,
    NULL, // reserved
    &cSubKeys,
    &cbMaxSubKey,
    &cchMaxClass,
    &cValues,
    &cchMaxValue,
    &cbMaxValueData,
    NULL, // can ignore these values
    NULL);

  if (retCode != ERROR_SUCCESS) {
    char* errorMessage = NULL;
    sprintf(errorMessage, "RegQueryInfoKey failed - exit code: '%d'", retCode);
    Nan::ThrowTypeError(errorMessage);
    return;
  }

  if (cValues == 0) {
    info.GetReturnValue().Set(New<v8::Array>(0));
    return;
  }

  Local<Array> a = New<v8::Array>(cValues);
  info.GetReturnValue().Set(a);

  DWORD i;
  for (i = 0, retCode = ERROR_SUCCESS; i<cValues; i++)
  {
    cchValue = MAX_VALUE_NAME;
    achValue[0] = '\0';

    DWORD lpType;
    DWORD cbData = cbMaxValueData;
    auto buffer = new byte[cbMaxValueData];

    retCode = RegEnumValue(
      hCurrentKey,
      i,
      achValue,
      &cchValue,
      NULL,
      &lpType,
      buffer,
      &cbData);

    if (retCode == ERROR_SUCCESS)
    {
      if (lpType == REG_SZ)
      {
        auto text = (char *)buffer;
        auto obj = CreateEntry(achValue, "REG_SZ", text);
        Nan::Set(a, i, obj);
      }
      else if (lpType == REG_EXPAND_SZ)
      {
        auto text = (char *)buffer;
        auto obj = CreateEntry(achValue, "REG_EXPAND_SZ", text);
        Nan::Set(a, i, obj);
      }
      else if (lpType == REG_DWORD)
      {
        // NOTE:
        // at this point the value in buffer looks like this: '\x124242'
        // i haven't figured out an easy way to parse this, so I'm going to make
        // a second call because I know I can get the value out in the correct
        // format in this way and avoid messing with strings
        unsigned long size = 1024;

        LONG nError = RegQueryValueEx(hCurrentKey, achValue, NULL, &lpType, (LPBYTE)&cbData, &size);
        if (ERROR_SUCCESS == nError)
        {
          Nan::Set(a, i, CreateEntry(achValue, "REG_DWORD", cbData));
        }
      }
    }
    else if (retCode != ERROR_NO_MORE_ITEMS)
    {
      char* errorMessage = NULL;
      sprintf(errorMessage, "RegEnumValue returned an error code: '%d'", retCode);
      Nan::ThrowTypeError(errorMessage);
    }
  }

  RegCloseKey(hCurrentKey);
}

void Init(v8::Handle<v8::Object> exports) {
  Nan::SetMethod(exports, "readValues", ReadValues);
}

}

NODE_MODULE(registryNativeModule, Init);
