// 메뉴 데이터: 사진 링크 포함
const menuData = [
  {
    category: "정식",
    items: [
      { name: "등심카츠 정식", price: 11000, img: "images/deungsim.png" },
      { name: "안심카츠 정식", price: 12000, img: "images/ansim.png" },
      { name: "치즈카츠 정식", price: 12000, img: "images/cheese.png" },
      { name: "사사미카츠 정식[닭안심]", price: 11000, img: "images/sasame.png" }
    ]
  },
  {
    category: "덮밥",
    items: [
      { name: "돈카츠카레", price: 10000, img: "images/doncurry.png" },
      { name: "사케동(연어덮밥)", price: 13000, img: "images/sakedong.png" },
      { name: "연어장동(연어장덮밥)", price: 13000, img: "images/yeonuhjangdong.png" },
      { name: "유케동", price: 10000, img: "images/ukedong.png" }
    ]
  },
  {
    category: "면류",
    items: [
      { name: "저스트 카레우동", price: 7000, img: "images/just curry u dong.png" },
      { name: "뜨끈우동", price: 6000, img: "images/DGudong.png" },
      { name: "저스트 냉모밀", price: 7000, img: "images/just momeal.png" }
    ]
  },
  {
    category: "사이드",
    items: [
      { name: "가라아게", price: 5900, img: "images/gara.png" },
      { name: "감자고로케(4pc)", price: 5000, img: "images/gamja.png" }
    ]
  },
  {
    category: "음료",
    items: [
      { name: "펩시제로 355ml", price: 2000, img: "images/pepsi.png" },
      { name: "코카콜라 355ml", price: 2000, img: "images/coke.png" },
      { name: "칠성사이다 355ml", price: 2000, img: "images/cider.png" },
      { name: "탐스제로 355ml", price: 2000, img: "images/tams.png" }
    ]
  }
];

let cart = [];

const menuContainer = document.getElementById('menu-container');
const cartBox = document.getElementById('cart-box');
const cartItemsDiv = document.getElementById('cart-items');
const cartTotalSpan = document.getElementById('cart-total');
const toOrderBtn = document.getElementById('to-order-btn');

const orderFormBox = document.getElementById('order-form-box');
const orderCartListDiv = document.getElementById('order-cart-list');
const tableNumberInput = document.getElementById('table-number');
const orderNoteInput = document.getElementById('order-note');
const toSummaryBtn = document.getElementById('to-summary-btn');
const backToCartBtn = document.getElementById('back-to-cart-btn');

const orderSummaryBox = document.getElementById('order-summary-box');
const summaryDetailsDiv = document.getElementById('summary-details');
const finalizeOrderBtn = document.getElementById('finalize-order-btn');
const backToOrderBtn = document.getElementById('back-to-order-btn');

// 메뉴 렌더링
function renderMenu() {
  menuContainer.innerHTML = '';
  menuData.forEach(category => {
    const catTitle = document.createElement('h2');
    catTitle.textContent = category.category;
    menuContainer.appendChild(catTitle);

    category.items.forEach(item => {
      const menuItemDiv = document.createElement('div');
      menuItemDiv.classList.add('menu-item');

      // 이미지
      const img = document.createElement('img');
      img.src = item.img;
      img.alt = item.name;
      img.classList.add('menu-img');

      // 이름, 가격 영역
      const infoDiv = document.createElement('div');
      infoDiv.classList.add('menu-info');

      const nameDiv = document.createElement('div');
      nameDiv.classList.add('menu-name');
      nameDiv.textContent = item.name;

      const priceDiv = document.createElement('div');
      priceDiv.classList.add('menu-price');
      priceDiv.textContent = item.price.toLocaleString() + '원';

      infoDiv.appendChild(img);
      infoDiv.appendChild(nameDiv);

      menuItemDiv.appendChild(infoDiv);
      menuItemDiv.appendChild(priceDiv);

      menuItemDiv.addEventListener('click', () => addToCart(item));

      menuContainer.appendChild(menuItemDiv);
    });
  });
}

// 장바구니에 담기
function addToCart(item) {
  const found = cart.find(c => c.name === item.name);
  if (found) {
    found.qty++;
    found.totalPrice = found.price * found.qty;
  } else {
    cart.push({ ...item, qty: 1, totalPrice: item.price });
  }
  updateCart();
}

// 장바구니 업데이트
function updateCart() {
  if (cart.length === 0) {
    cartItemsDiv.textContent = '장바구니가 비었습니다.';
    toOrderBtn.disabled = true;
    cartTotalSpan.textContent = '0';
    return;
  }
  toOrderBtn.disabled = false;

  cartItemsDiv.innerHTML = '';
  cart.forEach((item, idx) => {
    const cartItemDiv = document.createElement('div');
    cartItemDiv.classList.add('cart-item');

    const nameDiv = document.createElement('div');
    nameDiv.textContent = item.name;
    cartItemDiv.appendChild(nameDiv);

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.min = '1';
    qtyInput.value = item.qty;
    qtyInput.classList.add('qty-input');
    qtyInput.addEventListener('change', e => {
      const val = parseInt(e.target.value);
      if (isNaN(val) || val < 1) {
        e.target.value = item.qty;
        return;
      }
      item.qty = val;
      item.totalPrice = item.price * val;
      updateCart();
    });
    cartItemDiv.appendChild(qtyInput);

    const priceDiv = document.createElement('div');
    priceDiv.textContent = item.totalPrice.toLocaleString() + '원';
    cartItemDiv.appendChild(priceDiv);

    const delBtn = document.createElement('button');
    delBtn.textContent = '삭제';
    delBtn.classList.add('delete-btn');
    delBtn.addEventListener('click', () => {
      cart.splice(idx, 1);
      updateCart();
    });
    cartItemDiv.appendChild(delBtn);

    cartItemsDiv.appendChild(cartItemDiv);
  });

  const total = cart.reduce((acc, c) => acc + c.totalPrice, 0);
  cartTotalSpan.textContent = total.toLocaleString();
}

// 주문서 작성 버튼 클릭
toOrderBtn.addEventListener('click', () => {
  if (cart.length === 0) return;
  tableNumberInput.value = '';
  orderNoteInput.value = '';
  renderOrderCartPreview();
  showMenu(false);
  showOrderForm(true);
  showOrderSummary(false);
});

// 주문서 입력 박스 위쪽 장바구니 미리보기 렌더링
function renderOrderCartPreview() {
  orderCartListDiv.innerHTML = '';

  if (cart.length === 0) {
    orderCartListDiv.textContent = '장바구니가 비었습니다.';
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  ['메뉴명', '수량', '가격'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.borderBottom = '1px solid #ddd';
    th.style.padding = '5px';
    th.style.textAlign = 'left';
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  cart.forEach(item => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tdName.style.padding = '5px';

    const tdQty = document.createElement('td');
    tdQty.textContent = item.qty;
    tdQty.style.padding = '5px';

    const tdPrice = document.createElement('td');
    tdPrice.textContent = item.totalPrice.toLocaleString() + '원';
    tdPrice.style.padding = '5px';

    tr.appendChild(tdName);
    tr.appendChild(tdQty);
    tr.appendChild(tdPrice);

    tbody.appendChild(tr);
  });
  table.appendChild(tbody);

  orderCartListDiv.appendChild(table);
}

// 주문 요약 보기 버튼 클릭
toSummaryBtn.addEventListener('click', () => {
  if (!tableNumberInput.value.trim()) {
    alert('테이블 번호를 입력해주세요.');
    return;
  }
  renderOrderSummary();
  showMenu(false);
  showOrderForm(false);
  showOrderSummary(true);
});

// 주문 요약 화면 렌더링
function renderOrderSummary() {
  summaryDetailsDiv.innerHTML = '';

  const table = document.createElement('table');
  const thead = document.createElement('thead');
  const trHead = document.createElement('tr');
  ['메뉴명', '수량', '가격'].forEach(text => {
    const th = document.createElement('th');
    th.textContent = text;
    trHead.appendChild(th);
  });
  thead.appendChild(trHead);
  table.appendChild(thead);

  const tbody = document.createElement('tbody');

  cart.forEach(item => {
    const tr = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.textContent = item.name;
    tr.appendChild(tdName);

    const tdQty = document.createElement('td');
    tdQty.textContent = item.qty;
    tr.appendChild(tdQty);

    const tdPrice = document.createElement('td');
    tdPrice.textContent = item.totalPrice.toLocaleString() + '원';
    tr.appendChild(tdPrice);

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  summaryDetailsDiv.appendChild(table);

  // 주문 정보 추가
  const orderInfo = document.createElement('div');
  orderInfo.style.marginTop = '15px';
  orderInfo.innerHTML = `
    <p><strong>테이블 번호:</strong> ${tableNumberInput.value}</p>
    <p><strong>요청사항:</strong> ${orderNoteInput.value.trim() || '없음'}</p>
    <p><strong>총 합계:</strong> ${cart.reduce((a,c) => a + c.totalPrice, 0).toLocaleString()}원</p>
  `;
  summaryDetailsDiv.appendChild(orderInfo);
}

// 최종 주문 버튼 클릭
finalizeOrderBtn.addEventListener('click', () => {
  alert('주문이 완료되었습니다! 감사합니다.');
  cart = [];
  updateCart();
  showMenu(true);
  showOrderForm(false);
  showOrderSummary(false);
});

// 주문서 수정 버튼 클릭
backToOrderBtn.addEventListener('click', () => {
  showMenu(false);
  showOrderForm(true);
  showOrderSummary(false);
});

// 장바구니로 돌아가기 버튼 클릭
backToCartBtn.addEventListener('click', () => {
  showMenu(true);
  showOrderForm(false);
  showOrderSummary(false);
});

// 화면 전환 함수
function showMenu(show) {
  menuContainer.style.display = show ? 'block' : 'none';
  cartBox.style.display = show ? 'block' : 'none';
}
function showOrderForm(show) {
  orderFormBox.style.display = show ? 'block' : 'none';
  if (show) {
    cartBox.style.display = 'none'; // 주문서 입력 시 장바구니 숨기기
  }
}
function showOrderSummary(show) {
  orderSummaryBox.style.display = show ? 'block' : 'none';
  cartBox.style.display = 'none';
}

// 초기 렌더링
renderMenu();
updateCart();
