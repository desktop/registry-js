
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

v8::Local<v8::Object> CreateEntry(TCHAR *name, TCHAR *type, char *data)
{
  auto obj = Nan::New<v8::Object>();
  obj->Set(Nan::New("name").ToLocalChecked(), Nan::New(name).ToLocalChecked());
  obj->Set(Nan::New("type").ToLocalChecked(), Nan::New(type).ToLocalChecked());
  obj->Set(Nan::New("data").ToLocalChecked(), Nan::New<v8::String>(data).ToLocalChecked());
  return obj;
}

v8::Local<v8::Object> CreateEntry(TCHAR *name, TCHAR *type, DWORD data)
{
  auto obj = Nan::New<v8::Object>();
  obj->Set(Nan::New("name").ToLocalChecked(), Nan::New(name).ToLocalChecked());
  obj->Set(Nan::New("type").ToLocalChecked(), Nan::New(type).ToLocalChecked());
  obj->Set(Nan::New("data").ToLocalChecked(), Nan::New((INT32)data));
  return obj;
}

NAN_METHOD(ReadValues)
{
  if (info.Length() < 2)
  {
    Nan::ThrowTypeError("Wrong number of arguments");
    return;
  }

  if (!info[0]->IsNumber())
  {
    Nan::ThrowTypeError("A number was expected for the first argument, but wasn't received.");
    return;
  }

  if (!info[1]->IsString())
  {
    Nan::ThrowTypeError("A string was expected for the second argument, but wasn't received.");
    return;
  }

  ULONG first = info[0]->NumberValue();
  auto second = *v8::String::Utf8Value(info[1]);

  HKEY hCurrentKey;
  LONG openKey = RegOpenKeyEx(
    (HKEY)first,
    second,
    0,
    KEY_READ | KEY_WOW64_64KEY,
    &hCurrentKey);

  if (openKey == ERROR_FILE_NOT_FOUND)
  {
    // the key does not exist, just return an empty array for now
    info.GetReturnValue().Set(New<v8::Array>(0));
  }
  else if (openKey == ERROR_SUCCESS)
  {
    TCHAR achClass[MAX_PATH] = TEXT("");  // buffer for class name
    DWORD cchClassName = MAX_PATH;        // size of class string
    DWORD cValues, cchMaxValue, cbMaxValueData;

    TCHAR achValue[MAX_VALUE_NAME];
    DWORD cchValue = MAX_VALUE_NAME;

    auto retCode = RegQueryInfoKey(
      hCurrentKey,
      achClass,
      &cchClassName,
      NULL, // reserved
      NULL, // can ignore subkey values
      NULL,
      NULL,
      &cValues, // number of values for key
      &cchMaxValue, // longest value name
      &cbMaxValueData, // longest value data
      NULL, // can ignore these values
      NULL);

    if (retCode != ERROR_SUCCESS)
    {
      char* errorMessage = NULL;
      sprintf(errorMessage, "RegQueryInfoKey failed - exit code: '%d'", retCode);
      Nan::ThrowTypeError(errorMessage);
    }
    else
    {
      auto results = New<v8::Array>(cValues);
      info.GetReturnValue().Set(results);

      for (DWORD i = 0, retCode = ERROR_SUCCESS; i < cValues; i++)
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
            Nan::Set(results, i, obj);
          }
          else if (lpType == REG_EXPAND_SZ)
          {
            auto text = (char *)buffer;
            auto obj = CreateEntry(achValue, "REG_EXPAND_SZ", text);
            Nan::Set(results, i, obj);
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
              Nan::Set(results, i, CreateEntry(achValue, "REG_DWORD", cbData));
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
  }
  else
  {
    char* errorMessage = NULL;
    sprintf(errorMessage, "RegOpenKeyEx failed - exit code: '%d'", openKey);
    Nan::ThrowTypeError(errorMessage);
  }
}

void Init(v8::Handle<v8::Object> exports) {
  Nan::SetMethod(exports, "readValues", ReadValues);
}

}

NODE_MODULE(registryNativeModule, Init);
