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

const TicketViewPage = () => {
  const router = useRouter();
  const ticketId = router.query.id.replace("ticket-", "");
  const { user } = React.useContext(AuthContext);
  const { jwt, id, username } = user;
  const inputFileRef = React.useRef();
  const [ticketData, setTicketData] = React.useState(null);
  const [message, setMessage] = React.useState("");
  const [attachments, setAttachments] = React.useState([]);
  const [replies, setReplies] = React.useState([]);
  const [posting, setPosting] = React.useState(false);

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
    let newReplies = [
      ...replies,
      {
        __component: "useful.ticket-reply",
        isAdmin: true,
        message: message,
        replyDate: Date.now(),
      },
    ];
    setPosting(true);
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
        if (attachments.length > 0) {
          handleSubmitFiles(createdReplyId);
        }
        handleArrangeReplies([
          ...replies,
          {
            __component: "useful.ticket-reply",
            isAdmin: true,
            message: message,
            replyDate: Date.now(),
            attachments,
          },
        ]);
      }
    } catch (error) {
      console.log("the error", error);
      setPosting(false);
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

  const handleArrangeReplies = (data) => {
    let sortedArr = data.slice().sort((a, b) => {
      return new Date(b.replyDate) - new Date(a.replyDate);
    });
    setPosting(false);
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

  const hanldeCloseTicket = async () => {
    try {
      const response = await fetch(getStrapiURL(`/tickets/${ticketData.id}`), {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          open: false,
        }),
      });
      const { status } = response;
      console.log(status);
      if (status == 200) {
        setTicketData({ ...ticketData, open: false });
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  const handleReOpenTicket = async () => {
    try {
      const response = await fetch(getStrapiURL(`/tickets/${ticketData.id}`), {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({
          open: true,
        }),
      });
      const { status } = response;
      console.log(status);
      if (status == 200) {
        setTicketData({ ...ticketData, open: true });
      }
    } catch (error) {
      console.log("the error", error);
    }
  };

  React.useEffect(() => {
    fetchTicketData();
  }, []);

  React.useEffect(() => {
    if (ticketData && !posting) {
      handleArrangeReplies(ticketData.replies);
    }
  }, [ticketData]);

  return (
    <ProtectedRoute router={router}>
      <LayoutSidebar>
        <div>
          <div className="flex flex-row justify-between">
            <h3 className="text-gray-700 text-3xl font-medium">
              Ticket #{ticketId}
            </h3>

            <div className="flex flex-row justify-between">
              {ticketData && ticketData.open ? (
                <button
                  onClick={() => hanldeCloseTicket()}
                  className="mr-2 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                >
                  Close Ticket
                </button>
              ) : (
                <button
                  onClick={() => handleReOpenTicket()}
                  className="mr-2 bg-orange-300 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded"
                >
                  Re-Open Ticket
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col mt-8">
            <div className="-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
              {ticketData && ticketData.open ? (
                <div>
                  <label className="block text-left mb-4" style={{}}>
                    <span className="text-gray-700">Reply</span>
                    <textarea
                      onChange={(e) => setMessage(e.target.value)}
                      value={message}
                      className="form-textarea mt-1 block w-full"
                      rows="3"
                      placeholder="Type your reply"
                    ></textarea>
                  </label>
                  <div className="mb-4">
                    <span>Attached Files ({attachments.length})</span>
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
                  <div>
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
                      className="mr-2 cursor-pointer bg-blue-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Attach files
                    </a>
                    <a
                      onClick={handleSubmitReply}
                      className="cursor-pointer bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Send reply
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
                      <p className="font-bold">Ticket is closed</p>
                      <p className="text-sm">
                        You can't reply to this ticket because it is closed.
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
                          Date
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
                          From
                        </th>

                        <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {item.isAdmin ? "You" : "User"}
                        </td>
                      </tr>
                      <tr className="flex flex-row">
                        <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                          Message
                        </th>
                        <td className="bg-white w-10/12 px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500">
                          {item.message}
                        </td>
                      </tr>
                      {item.attachments.length > 0 && (
                        <tr className="flex flex-row">
                          <th className="px-6 py-3 border-b border-gray-200 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider w-2/12">
                            Attachments
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

// export async function getStaticProps(context) {
//   const { params, locale, locales, defaultLocale, preview = null } = context;

//   const globalLocale = await getGlobalData(locale);
//   // Fetch pages. Include drafts if preview mode is on

//   const pageContext = {
//     locales,
//     defaultLocale,
//     slug: "testing",
//   };

//   const localizedPaths = getLocalizedPaths(pageContext);

//   return {
//     props: {
//       global: globalLocale,
//       pageContext: {
//         ...pageContext,
//         localizedPaths,
//       },
//     },
//   };
// }

export default TicketViewPage;

// export const getStaticPaths = async () => {
//   const res = await fetch(getStrapiURL("/tickets"));
//   const data = await res.json();

//   const paths = data.map((item) => {
//     return {
//       params: { id: `ticket-${item.code.toString()}` },
//     };
//   });

//   return {
//     paths,
//     fallback: false,
//   };
// };
