"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hooks";
import { removeToken } from "@/redux/slices/authSlice";
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
    <div className="min-h-screen flex items-center justify-center bg-red-50 p-4">
      <Card className="w-full max-w-md border-2 border-red-500" shadow="none">
        <CardBody className="gap-5 text-center py-8">
          <div className="flex justify-center">
            <AlertTriangle className="w-12 h-12 text-red-500" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
            <p className="text-red-500">
              Anda tidak memiliki izin untuk mengakses halaman ini.
            </p>
          </div>

          <div className="bg-red-100 border border-red-200 rounded-xl p-6">
            <h3 className="text-red-600 font-semibold mb-2">
              Diperlukan Otentikasi
            </h3>
            <p className="text-red-600">
              Silakan masuk dengan akun yang memiliki izin yang diperlukan untuk
              mengakses sumber daya ini.
            </p>
          </div>
        </CardBody>

        <CardFooter className="justify-center pb-8">
          <Button
            color="danger"
            size="lg"
            onClick={handleGoBack}
            variant="flat"
          >
            Kembali ke Halaman Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Unauthorized;
