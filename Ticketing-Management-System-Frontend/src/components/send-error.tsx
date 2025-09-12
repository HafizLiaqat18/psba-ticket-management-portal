import toast from "react-hot-toast";
import axios from "axios";

export default function showError(err: unknown): void {
  let errorMessage = "Something went wrong";

  if (axios.isAxiosError(err)) {
    errorMessage = err.response?.data?.message || errorMessage;
  } else if (err instanceof Error) {
    errorMessage = err.message;
  }

  toast.error(errorMessage);
}
