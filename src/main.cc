
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
    char* errorMessage;
    sprintf(errorMessage, "RegOpenKeyEx failed - exit code: '%d'", openKey);
    Nan::ThrowTypeError(errorMessage);
    return;
  }

  TCHAR    achClass[MAX_PATH] = TEXT("");  // buffer for class name
  DWORD    cchClassName = MAX_PATH;        // size of class string
  DWORD    cSubKeys = 0;                   // number of subkeys
  DWORD    cbMaxSubKey;                    // longest subkey size
  DWORD    cchMaxClass;                    // longest class string
  DWORD    cValues;                        // number of values for key
  DWORD    cchMaxValue;                    // longest value name
  DWORD    cbMaxValueData;                 // longest value data
  DWORD    cbSecurityDescriptor;           // size of security descriptor
  FILETIME ftLastWriteTime;                // last write time

  TCHAR  achValue[MAX_VALUE_NAME];
  DWORD cchValue = MAX_VALUE_NAME;

  auto retCode = RegQueryInfoKey(
    hCurrentKey,                    // key handle
    achClass,                // buffer for class name
    &cchClassName,           // size of class string
    NULL,                    // reserved
    &cSubKeys,               // number of subkeys
    &cbMaxSubKey,            // longest subkey size
    &cchMaxClass,            // longest class string
    &cValues,                // number of values for this key
    &cchMaxValue,            // longest value name
    &cbMaxValueData,         // longest value data
    &cbSecurityDescriptor,   // security descriptor
    &ftLastWriteTime);       // last write time

  if (cValues == 0) {
    info.GetReturnValue().Set(New<v8::Array>(0));
  }

  Local<Array> a = New<v8::Array>(cValues);

  DWORD i;
  for (i = 0, retCode = ERROR_SUCCESS; i<cValues; i++)
  {
    cchValue = MAX_VALUE_NAME;
    achValue[0] = '\0';

    DWORD lpType, lpcbData;
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
      if (lpType == REG_EXPAND_SZ) {
        auto text = (char *)buffer;
        auto obj = CreateEntry(achValue, "REG_EXPAND_SZ", text);
        Nan::Set(a, i, obj);
      }
    }
    else if (retCode != ERROR_NO_MORE_ITEMS)
    {
      char* errorMessage;
      sprintf(errorMessage, "RegEnumValue returned an error code: '%d'", retCode);
      Nan::ThrowTypeError(errorMessage);
    }
  }

  info.GetReturnValue().Set(a);

  RegCloseKey(hCurrentKey);
}

void Init(v8::Handle<v8::Object> exports) {
  Nan::SetMethod(exports, "readValues", ReadValues);
}

}

NODE_MODULE(registryNativeModule, Init);
