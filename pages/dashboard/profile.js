import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import ReactHtmlParser from "react-html-parser";
import { parseCookies } from "nookies";
import axios from "axios";
import { getStrapiMedia } from "utils/media";

const ProfilePage = ({ global, translations }) => {
  const router = useRouter();
  const inputFileRef = React.useRef();
  const { setUser, user, checkUser } = React.useContext(AuthContext);
  const {
    jwt,
    id: loggedInUserId,
    email,
    firstname,
    lastname,
    phoneNumber,
  } = user;
  const [imagePlaceHolder, setImagePlaceHolder] = React.useState(null);
  const [formValues, setFormValues] = React.useState({
    firstname: firstname,
    lastname: lastname,
    picture: null,
  });

  const formState = {
    ...formValues,
  };

  const setFormState = (name, value) => {
    setFormValues((old) => ({ ...old, [name]: value }));
  };

  const onBtnClick = () => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };

  const onFileChangeCapture = (e) => {
    setFormState("picture", e.target.files);
    setImagePlaceHolder(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmitData = async () => {
    if (!formState.firstname || !formState.lastname) {
      alert(translations.please_fill_all_fields);
      return;
    }
    try {
      const response = await fetch(getStrapiURL(`/users/${loggedInUserId}`), {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          firstname: formState.firstname,
          lastname: formState.lastname,
        }),
      });
      const { status } = response;
      if (status == 200) {
        setUser({
          ...user,
          firstname: formState.firstname,
          lastname: formState.lastname,
        });
        if (formState?.picture) {
          handleSubmitPicture();
        }
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleSubmitPicture = async () => {
    const formData = new FormData();

    formData.append("files", formState.picture[0]);
    formData.append("ref", "user");
    formData.append("source", "users-permissions");
    formData.append("refId", loggedInUserId);
    formData.append("field", "picture");

    try {
      axios
        .post(getStrapiURL(`/upload`), formData, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        })
        .then(() => {
          checkUser();
        });
    } catch (error) {
      console.log("the error", error);
    }
  };

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        {" "}
        <div>
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white px-6 py-6 border-b">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  {translations.my_account}
                </h6>
                <button
                  onClick={handleSubmitData}
                  className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150"
                >
                  {translations.save_edit}
                </button>
              </div>
            </div>
            <div className="bg-white flex-auto px-4 lg:px-10 py-10 pt-4">
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20 rounded-full">
                  <img
                    src={
                      imagePlaceHolder
                        ? imagePlaceHolder
                        : getStrapiMedia(
                            user.picture
                              ? user.picture.url
                              : "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7InBhdGgiOiJcL2ZcLzI3MWRlZWE4LWUyOGMtNDFhMy1hYWY1LTI5MTNmNWY0OGJlNlwvZGU3ODM0cy02NTE1YmQ0MC04YjJjLTRkYzYtYTg0My01YWMxYTk1YThiNTUuanBnIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmZpbGUuZG93bmxvYWQiXX0.BopkDn1ptIwbmcKHdAOlYHyAOOACXW0Zfgbs0-6BY-E"
                          )
                    }
                    alt=""
                    className="object-contain bg-white border w-20 h-20 rounded-full"
                  />
                  <div className="absolute top-1 -end-4">
                    <input
                      ref={inputFileRef}
                      className="hidden"
                      type="file"
                      onChangeCapture={onFileChangeCapture}
                    />
                    <button
                      onClick={onBtnClick}
                      className="rounded px-2 p-1 text-xs text-white bg-primary-500"
                    >
                      {translations.edit}
                    </button>
                  </div>
                </div>
              </div>

              {/* <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                User Information
              </h6> */}
              <div className="flex flex-wrap mt-8">
                <div className="w-full lg:w-6/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="phoneNumber"
                    >
                      {translations.phone_number}
                    </label>
                    <input
                      id="phoneNumber"
                      type="text"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={phoneNumber}
                      disabled
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="email"
                    >
                      {translations.email}
                    </label>
                    <input
                      onChange={(e) => setFormState("email", e.target.value)}
                      id="email"
                      type="email"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-gray-200 rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={email}
                      disabled
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap mt-8">
                <div className="w-full lg:w-6/12">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="firstname"
                    >
                      {translations.first_name}
                    </label>
                    <input
                      onChange={(e) =>
                        setFormState("firstname", e.target.value)
                      }
                      id="firstname"
                      type="firstname"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={formState.firstname}
                    />
                  </div>
                </div>
                <div className="w-full lg:w-6/12 px-4">
                  <div className="relative w-full mb-3">
                    <label
                      className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                      htmlFor="lastname"
                    >
                      {translations.last_name}
                    </label>
                    <input
                      onChange={(e) => setFormState("lastname", e.target.value)}
                      id="lastname"
                      type="lastname"
                      className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                      value={formState.lastname}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default ProfilePage;
