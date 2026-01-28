const modal = document.getElementById("modal");
const form = document.getElementById("buyForm");

function buy(product, price) {
  modal.style.display = "flex";
  form.product.value = product;
  form.price.value = price;
}

function closeModal() {
  modal.style.display = "none";
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  const res = await fetch("/buy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  const result = await res.json();

  if (result.success) {
    alert("Order placed successfully!");
    closeModal();
    form.reset();
  } else {
    alert("Failed to place order");
  }
});
