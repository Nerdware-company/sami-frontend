import { MdCheckBox } from "react-icons/md";
import classNames from "classnames";
import React from "react";

const Pricing = ({ data }) => {
  const [chosenItems, setChosenItems] = React.useState([]);
  const [numberOfUsers, setNumberOfUsers] = React.useState(1);

  const handleChooseItem = (item) => {
    if (chosenItems.indexOf(item) != -1) {
      setChosenItems([...chosenItems.filter((fi) => fi !== item)]);
    } else {
      setChosenItems([...chosenItems, item]);
    }
  };

  const incrementUsers = () => {
    setNumberOfUsers((old) => old + 1);
  };

  const decrementUsers = () => {
    if (numberOfUsers > 1) {
      setNumberOfUsers((old) => old - 1);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl text-center">{data.title}</h1>
      <div className="flex flex-col lg:flex-row gap-6 lg:justify-center mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {data.services.map((service) => (
            <div
              className="pricing-item"
              onClick={() => handleChooseItem(service)}
            >
              <div className="inner">
                <div className="pricing-item__left me-2">
                  <img
                    className="object-center object-cover h-12 w-12 me-2"
                    src={`http://localhost:1337${service.picture[0].url}`}
                    alt="photo"
                  />
                  <p className="text-xl text-black-100 font-bold mb-2">
                    {service.title}
                  </p>
                </div>
                <div className="pricing-item__right">
                  <div
                    className={`checkmark ${
                      chosenItems.indexOf(service) != -1 && "checked"
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="billing">
          {/* <div className="billing__top">
            <a href="" className="billing__top-item">
              Annually
            </a>
            <a href="" className="billing__top-item">
              Monthly
            </a>
          </div> */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            Users:{" "}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
              onClick={decrementUsers}
            >
              <p style={{ textAlign: "center" }}>-</p>
            </div>
            <p style={{ paddingRight: "5px", paddingLeft: "5px" }}>
              {numberOfUsers}
            </p>
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ccc",
                width: "25px",
                height: "25px",
                cursor: "pointer",
              }}
              onClick={incrementUsers}
            >
              <p style={{ textAlign: "center" }}>+</p>
            </div>
          </div>
          <div>Apps: {chosenItems.length}</div>
          <div>
            Total/Month:{" "}
            {chosenItems.reduce((acc, curr) => acc + curr.monthlyPrice, 0) +
              numberOfUsers * data.pricePerUser}
          </div>
          <div>
            Total/Year:{" "}
            {chosenItems.reduce((acc, curr) => acc + curr.yearlyPrice, 0) +
              numberOfUsers * data.pricePerUser}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
