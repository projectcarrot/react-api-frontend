import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function loadItem() {
    const res = await fetch(`http://localhost:3000/api/item/${id}`);
    const data = await res.json();

    itemNameRef.current.value = data.itemName;
    itemCategoryRef.current.value = data.itemCategory;
    itemPriceRef.current.value = data.itemPrice;
  }

  useEffect(() => {
    loadItem();
  }, []);

  async function onUpdate() {
    await fetch(`http://localhost:3000/api/item/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: itemNameRef.current.value,
        itemCategory: itemCategoryRef.current.value,
        itemPrice: itemPriceRef.current.value,
      }),
    });

    navigate("/item");
  }

  return (
    <div>
      <h3>Edit Item</h3>
      <input ref={itemNameRef} />
      <select ref={itemCategoryRef}>
        <option>Stationary</option>
        <option>Kitchenware</option>
        <option>Appliance</option>
      </select>
      <input ref={itemPriceRef} />
      <br />
      <button onClick={onUpdate}>Update</button>
    </div>
  );
}