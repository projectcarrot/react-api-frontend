import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function Item() {
  const [items, setItems] = useState([]);

  const itemNameRef = useRef();
  const itemCategoryRef = useRef();
  const itemPriceRef = useRef();

  async function fetchItems() {
    const res = await fetch("http://localhost:3000/api/item");
    const data = await res.json();
    setItems(data);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function onItemSave() {
    await fetch("http://localhost:3000/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        itemName: itemNameRef.current.value,
        itemCategory: itemCategoryRef.current.value,
        itemPrice: itemPriceRef.current.value,
        status: "ACTIVE",
      }),
    });

    itemNameRef.current.value = "";
    itemPriceRef.current.value = "";
    fetchItems();
  }

  async function onDelete(id) {
    await fetch(`http://localhost:3000/api/item/${id}`, {
      method: "DELETE",
    });
    fetchItems();
  }

  return (
    <table border="1">
      <thead>
        <tr>
          <th>Name</th>
          <th>Category</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item) => (
          <tr key={item._id}>
            <td>{item.itemName}</td>
            <td>{item.itemCategory}</td>
            <td>{item.itemPrice}</td>
            <td>
              <Link to={`/items/${item._id}`}>Edit</Link>{" "}
              <button onClick={() => onDelete(item._id)}>Delete</button>
            </td>
          </tr>
        ))}

        <tr>
          <td><input ref={itemNameRef} /></td>
          <td>
            <select ref={itemCategoryRef}>
              <option>Stationary</option>
              <option>Kitchenware</option>
              <option>Appliance</option>
            </select>
          </td>
          <td><input ref={itemPriceRef} /></td>
          <td>
            <button onClick={onItemSave}>Add</button>
          </td>
        </tr>
      </tbody>
    </table>
  );
}