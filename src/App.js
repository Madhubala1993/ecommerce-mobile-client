import { useEffect, useState } from "react";
import "./App.css";
import { API } from "./global";

export default function App() {
  return (
    <div className="App">
      <PhoneList />
    </div>
  );
}

function PhoneList() {
  const [mobiles, setMobiles] = useState([]);

  useEffect(() => {
    fetch(`${API}/mobiles`)
      .then((data) => data.json())
      .then((mbs) => setMobiles(mbs));
  }, []);
  return (
    <div className="phone-list-container">
      {mobiles.map(({ _id, model, img, company }) => (
        <Phone key={_id} model={model} img={img} company={company} />
      ))}
    </div>
  );
}

function Phone({ model, img, company }) {
  return (
    <div className="phone-container">
      <img src={img} alt={model} className="phone-picture" />
      <h2 className="phone-name">{model}</h2>
      <p className="phone-company">{company}</p>
    </div>
  );
}
