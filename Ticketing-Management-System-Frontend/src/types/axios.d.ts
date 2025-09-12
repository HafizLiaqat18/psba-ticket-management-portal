import "axios";

declare module "axios" {
  interface AxiosRequestConfig {
    _skipAuthCheck?: boolean;
  }
}
