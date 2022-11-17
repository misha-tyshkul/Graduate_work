(function () {
  const burger = document.querySelector("#burger");
  const close = document.querySelector("#burger-close");
  const menu = document.querySelector("#burger-wrap");

  burger.addEventListener("click", function () {
    menu.classList.toggle("is-shown");
  });

  burger.addEventListener("click", function () {
    menu.classList.toggle("hide");
  });

  close.addEventListener("click", function () {
    menu.classList.toggle("is-shown");
  });
})();
