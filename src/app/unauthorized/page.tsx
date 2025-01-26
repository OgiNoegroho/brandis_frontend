"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/lib/redux/hooks";
import { removeToken } from "@/lib/redux/slices/authSlice";
import { Card, CardBody, CardFooter, Button } from "@nextui-org/react";
import { AlertTriangle } from "lucide-react";

const Unauthorized = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(removeToken());
  }, [dispatch]);

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br 
      from-red-50 to-red-100 p-4"
    >
      <Card className="w-full max-w-md shadow-lg border border-red-300 rounded-xl">
        <CardBody className="text-center space-y-6 py-10 px-6">
          <div className="flex justify-center">
            <AlertTriangle className="w-14 h-14 text-red-500" />
          </div>

          <h2 className="text-3xl font-extrabold text-red-600">
            Akses Ditolak
          </h2>
          <p className="text-sm text-red-500">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>

          <div className="bg-red-50 border border-red-200 rounded-lg p-5 shadow-sm">
            <h3 className="text-red-600 font-semibold mb-2 text-lg">
              Diperlukan Otentikasi
            </h3>
            <p className="text-red-600 text-sm">
              Silakan masuk dengan akun yang memiliki izin yang diperlukan untuk
              mengakses sumber daya ini.
            </p>
          </div>
        </CardBody>

        <CardFooter className="flex justify-center pb-6">
          <Button
            aria-label="Go back to login page"
            color="danger"
            size="lg"
            onPress={handleGoBack}
            variant="flat"
            className="hover:bg-red-600 hover:text-white transition-colors"
          >
            Kembali ke Halaman Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
