#include "nan.h"

namespace {

NAN_METHOD(HelloWorld) {
  auto value = "Hello world!";
  info.GetReturnValue().Set(Nan::New(value).ToLocalChecked());
}

void Init(v8::Handle<v8::Object> exports) {
	Nan::SetMethod(exports, "helloWorld", HelloWorld);
}

}

NODE_MODULE(registryNativeModule, Init);
