"use client";
import { Toaster } from "react-hot-toast";

import React from "react";

export default function ToastProvider() {
  return (
    <Toaster
      position="top-center"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        className: "",
        duration: 5000,
        removeDelay: 1000,
        style: {
          background: "#fff",
          color: "#363636",
        },

        success: {
          duration: 3000,
          iconTheme: {
            primary: "green",
            secondary: "black",
          },
        },
        error: {
          duration: 3000,
          iconTheme: {
            primary: "red",
            secondary: "white",
          },
        },
      }}
    />
  );
}
