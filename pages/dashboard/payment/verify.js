import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import Router, { useRouter } from "next/router";
import React, { useLayoutEffect } from "react";
import AuthContext from "store/authContext";
import { getStrapiURL } from "utils/api";

const VerifyPaymentPage = ({ global, translations }) => {
  const router = useRouter();
  const { user } = React.useContext(AuthContext);
  const { jwt, id: loggedInUserId, firstname, lastname, phoneNumber } = user;
  const [loading, setLoading] = React.useState(true);
  const [didOnce, setDidOnce] = React.useState(false);
  const tap_id = router.query.tap_id;

  const shouldGenerateInvoice = async (data) => {
    try {
      const response = await fetch(
        getStrapiURL(`/invoices/count?tap_id=${tap_id}`),
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwt}`,
          },
        }
      );

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        if (responseJSON > 0) {
          return false;
        } else {
          return true;
        }
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleGenerateInvoice = async (data) => {
    try {
      await fetch(getStrapiURL(`/invoices`), {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          subscription: data.id,
          coupon: data.coupon,
          subTotal: data.subtotal,
          total: data.total,
          status: "paid",
          paymentType: "creditcard",
          paidDate: Date.now(),
          tap_id: tap_id,
        }),
      });
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleUpdateSubscription = async (data) => {
    try {
      await fetch(getStrapiURL(`/subscriptions/${data.id}`), {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          services: data.service_ids,
          numberOfUsers: data.number_of_users,
          active: true,
        }),
      });
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleSendDataToVictor = async (data) => {
    if (data.type_of_payment === "CREATE") {
      try {
        await fetch("https://saas.top1erp.com/api/method/create_site", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `token 0b883280cd0494e:e838e7b55c9f33a`,
          },
          body: JSON.stringify({
            subdomain: data.subdomain,
            email: data.email,
            first_name: data.first_name,
            last_name: data.last_name,
            company_name: data.company_name,
            limit_info: {
              number_of_users: data.number_of_users,
              valid_untill: data.valid_untill,
              allowed_block_module: data.service_codes,
            },
          }),
        });
      } catch (error) {
        console.log("the error", error);
      }
    } else {
      try {
        await fetch("https://saas.top1erp.com/api/method/update_quota", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `token 0b883280cd0494e:e838e7b55c9f33a`,
          },
          body: JSON.stringify({
            subdomain: data.subdomain,
            limit_info: {
              number_of_users: data.number_of_users,
              valid_untill: data.valid_untill,
              allowed_block_module: data.service_codes,
            },
          }),
        });
      } catch (error) {
        console.log("the error", error);
      }
    }
  };

  const handleDoEverything = async (newSubscription) => {
    await shouldGenerateInvoice().then(async (result) => {
      if (result) {
        await handleGenerateInvoice(newSubscription).then(async () => {
          await handleUpdateSubscription(newSubscription).then(async () => {
            await handleSendDataToVictor(newSubscription).then(() => {
              setDidOnce(true);
            });
          });
        });
      }
      router.push("/dashboard/payment/success");
    });
  };

  useLayoutEffect(() => {
    if (!didOnce) {
      goSell.showResult({
        callback: async ({ callback }) => {
          console.log("doing it again");
          let { code } = callback.response;
          let { metadata } = callback;

          if (code === "000") {
            handleDoEverything({
              ...metadata,
              service_codes: metadata.service_codes.split(","),
              service_ids: metadata.service_ids.split(","),
            });
          } else {
            router.push("/dashboard/payment/fail");
          }
        },
      });
    }
  });

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar
        global={global}
        translations={translations}
      ></LayoutSidebar>
    </ProtectedRoute>
  );
};

export default VerifyPaymentPage;
