import LayoutSidebar from "@/components/dashboard/layouts/LayoutSidebar";
import ProtectedRoute from "@/components/dashboard/ProtectedRoute";
import { useRouter } from "next/router";
import React from "react";
import AuthContext from "store/authContext";
import { getGlobalData, getStrapiURL } from "utils/api";
import { getLocalizedPaths } from "utils/localize";
import querystring from "querystring";
import axios from "axios";
import moment from "moment";
import { getStrapiMedia } from "utils/media";

const TicketViewPage = ({ global, translations }) => {
  const router = useRouter();
  const ticketId = router.query.id.replace("ticket-", "");
  const { user } = React.useContext(AuthContext);
  const { jwt, id, firstname, lastname, phoneNumber } = user;
  const inputFileRef = React.useRef();
  const [ticketData, setTicketData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [replies, setReplies] = React.useState([]);

  const fetchTicketData = async () => {
    try {
      const response = await fetch(getStrapiURL(`/tickets/?code=${ticketId}`), {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      });

      const { status } = response;
      const responseJSON = await response.json();

      if (status == 200) {
        setTicketData(responseJSON[0]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleSubmitReply = async () => {
    if (!message || message.length < 20) {
      alert(translations.please_fill_all_fields);
      return;
    }

    let newReplies = [
      ...ticketData.replies,
      {
        __component: "useful.ticket-reply",
        isAdmin: false,
        message: message,
        replyDate: Date.now(),
      },
    ];

    try {
      const response = await fetch(getStrapiURL(`/tickets/${ticketData.id}`), {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          replies: newReplies,
        }),
      });
      const { status } = response;
      console.log(status);
      if (status == 200) {
        let responseJSON = await response.json();
        let responseReplies = responseJSON.replies;
        let createdReplyId = responseReplies[responseReplies.length - 1].id;
        handleSubmitFiles(createdReplyId);
        handleSetReplies([
          ...ticketData.replies,
          {
            __component: "useful.ticket-reply",
            isAdmin: false,
            message: message,
            replyDate: Date.now(),
            attachments,
          },
        ]);
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleSubmitFiles = async (refId) => {
    const formData = new FormData();

    Array.from(attachments).forEach((file) =>
      formData.append(`files`, file, file.name)
    );
    formData.append("ref", "useful.ticket-reply");
    // formData.append("source", "tickets.replies");
    formData.append("refId", refId);
    formData.append("field", "attachments");

    try {
      axios.post(getStrapiURL(`/upload`), formData, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleSetReplies = (data) => {
    let sortedArr = data.slice().sort((a, b) => {
      return new Date(b.replyDate) - new Date(a.replyDate);
    });

    setReplies(sortedArr);
  };

  const onFileChangeCapture = (e) => {
    setAttachments(e.target.files);
    console.log(e.target.files);
    // setImagePlaceHolder(URL.createObjectURL(e.target.files[0]));
  };

  const onAttachBtnClick = () => {
    inputFileRef.current.click();
  };

  React.useEffect(() => {
    fetchTicketData();
  }, []);

  React.useEffect(() => {
    if (ticketData) {
      handleSetReplies(ticketData.replies);
    }
  }, [ticketData]);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar global={global} translations={translations}>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              {translations.ticket} #{ticketId}
            </h3>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {ticketData && ticketData.open ? (
                <div>
                  <label className="block text-start mb-4" style={{}}>
                    <span className="text-gray-700">{translations.reply}</span>
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      className="form-textarea mt-1 block w-full"
                      rows="3"
                      placeholder={translations.reply}
                    ></textarea>
                  </label>
                  <div className="mb-4">
                    <span>
                      {translations.attached_files} ({attachments.length})
                    </span>
                    {Array.from(attachments).map((item, index) => (
                      <div className="block" key={index}>
                        <a
                          href={URL.createObjectURL(item)}
                          target="_blank"
                          className="text-sm text-gray-600"
                          rel="noreferrer"
                        >
                          {item.name}
                        </a>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-row justify-between w-2/12">
                    <input
                      ref={inputFileRef}
                      className="hidden"
                      type="file"
                      name="files"
                      multiple={true}
                      onChangeCapture={onFileChangeCapture}
                    />
                    <a
                      onClick={onAttachBtnClick}
                      className="me-2 cursor-pointer bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {translations.attach_file}
                    </a>
                    <a
                      onClick={handleSubmitReply}
                      className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      {translations.send_reply}
                    </a>
                  </div>
                </div>
              ) : (
                <div
                  className="bg-red-400 border-t-4 border-red-800 rounded-b text-gray-800 px-4 py-3 shadow-md"
                  role="alert"
                >
                  <div className="flex">
                    <div className="py-1">
                      <svg
                        className="fill-current h-6 w-6 text-red-800 mr-4"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                      >
                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold">{translations.ticket_closed}</p>
                      <p className="text-sm">
                        {translations.ticket_closed_cant_reply}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {replies.map((item, index) => (
            <div className="flex flex-col mt-8" key={index}>
              <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
                <div className="align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-b border-gray-200">
                  <table className="min-w-full">
                    <tbody>
                      <tr className="flex flex-row">
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                          {translations.date}
                        </th>

                        <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {/* {item.replyDate} */}
                          {moment(item.replyDate).format(
                            "MMMM Do YYYY, h:mm:ss a"
                          )}
                        </td>
                      </tr>
                      <tr className="flex flex-row">
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                          {translations.from}
                        </th>

                        <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {item.isAdmin ? (
                            <>{translations.support}</>
                          ) : (
                            <>{translations.you}</>
                          )}
                        </td>
                      </tr>
                      <tr className="flex flex-row">
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                          {translations.message}
                        </th>
                        <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {item.message}
                        </td>
                      </tr>
                      {item.attachments.length > 0 && (
                        <tr className="flex flex-row">
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            {translations.attached_files}
                          </th>
                          <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                            {Array.from(item.attachments).map((item, index) => (
                              <a
                                key={index}
                                href={
                                  item.url
                                    ? getStrapiMedia(item.url)
                                    : URL.createObjectURL(item)
                                }
                                target="_blank"
                                className="text-sm text-gray-600 mr-2"
                                rel="noreferrer"
                              >
                                {item.url
                                  ? item.url
                                  : URL.createObjectURL(item)}
                              </a>
                            ))}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </div>
      </LayoutSidebar>
    </ProtectedRoute>
  );
};

export default TicketViewPage;
