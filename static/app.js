async function editMemo(event) {
  const id = event.target.dataset.id;
  // prompt는 페이지에서 어떤값을 입력하는 칸이 나오도록 함
  const editInput = prompt("수정할 값을 입력하세요.");
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", // 바꿀때는 POST보다는 PUT
    headers: {
      "Content-Type": "application/json",
    },
    // 통신을 할때는 문자열로만 전송 가능해서 문자열로 body를 바꾸어주고
    // 전송한후 받는쪽에선 그것을 JSON으로 바꾸고 ... 이것을 반복
    body: JSON.stringify({
      id, // id: id
      content: editInput,
    }),
  });
  readMemo();
}

async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE", // 삭제할때는 DELETE
  });
  readMemo();
}

function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");
  const li = document.createElement("li");
  li.innerText = `${memo.content}`;
  //add in update!
  const editBtn = document.createElement("button");
  editBtn.innerText = "수정";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id;
  //add in delete!
  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  ul.appendChild(li); // ul에 li추가
  //add in update!
  li.appendChild(editBtn);
  //add in delete!
  li.appendChild(delBtn);
}

async function readMemo() {
  const res = await fetch("/memos"); //디폴트는 GET 요청
  const jsonRes = await res.json();
  // jsonRes = [{id:123, content: "~~~"}]

  // ul 초기화
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = "";
  jsonRes.forEach(displayMemo);
}

//서버에 메모를 만들어 달라는 요청을 보낸다
// request body로 post를 보낸다.
async function createMemo(value) {
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // 통신을 할때는 문자열로만 전송 가능해서 문자열로 body를 바꾸어주고
    // 전송한후 받는쪽에선 그것을 JSON으로 바꾸고 ... 이것을 반복
    body: JSON.stringify({
      id: new Date(),
      content: value,
    }),
  }); // post방식으로 해야함
  readMemo();
}

function handleSubmit(event) {
  event.preventDefault();
  const input = document.querySelector("#memo-input");
  createMemo(input.value);
  input.value = "";
}

const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit);

// 새로고침 해도 메모가 페이지에 그대로 있게 해줌
readMemo();
