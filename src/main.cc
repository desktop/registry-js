#include "nan.h"
#include <windows.h>

using namespace Nan;
using namespace v8;

namespace {

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

  long first = info[0]->NumberValue();
  auto second = info[1]->ToString();

  HKEY hkey = (HKEY)first;
  String::Utf8Value substring(second);

	HKEY hTestKey;

	auto openKey = RegOpenKeyEx(
		hkey,
		*substring,
		0,
		KEY_READ | KEY_WOW64_64KEY,
		&hTestKey);

  // TODO: read registry values at spot

  // TODO: array length should be set by value found from Win32 API
  Local<Array> a = New<v8::Array>(0);
  //Nan::Set(a, 0, Nan::New(arr[0]));

  info.GetReturnValue().Set(a);

	RegCloseKey(hTestKey);
}

void Init(v8::Handle<v8::Object> exports) {
  Nan::SetMethod(exports, "readValues", ReadValues);
}

}

NODE_MODULE(registryNativeModule, Init);
