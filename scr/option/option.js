/**
 * option.js — 設定ページのスクリプト
 * ブロックするユーザー名の一覧を管理する
 */

const STORAGE_KEY = "nicodel_block_list";

const listTable = document.getElementById("upList");
const form = document.getElementById("newName");
const nameInput = document.getElementById("name");
const resetBtn = document.getElementById("reset");
const emptyState = document.getElementById("emptyState");

let blockList = [];

/** ストレージに保存 */
function save() {
  return chrome.storage.local.set({ [STORAGE_KEY]: blockList });
}

/** 指定したユーザー名をリストから削除 */
function removeEntry(name) {
  blockList = blockList.filter((n) => n !== name);
  save();
  render();
}

/** テーブルを再描画 */
function render() {
  listTable.innerHTML = "";
  emptyState.hidden = blockList.length > 0;

  blockList.forEach((name) => {
    const row = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.className = "name-cell";
    nameTd.textContent = name;

    const actionTd = document.createElement("td");
    actionTd.className = "action-cell";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.setAttribute("aria-label", `${name} を削除`);
    deleteBtn.textContent = "×";
    deleteBtn.addEventListener("click", () => removeEntry(name));

    actionTd.appendChild(deleteBtn);
    row.appendChild(nameTd);
    row.appendChild(actionTd);
    listTable.appendChild(row);
  });
}

/** 初期化：ストレージからリストを読み込む */
async function init() {
  const storage = await chrome.storage.local.get(STORAGE_KEY);
  blockList = storage[STORAGE_KEY] ?? [];
  render();
}

/** フォーム送信：ユーザー名を追加 */
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = nameInput.value.trim();
  if (name && !blockList.includes(name)) {
    blockList.push(name);
    save();
    render();
  }
  nameInput.value = "";
});

/** リセット */
resetBtn.addEventListener("click", () => {
  if (!confirm("すべての設定をリセットしますか？")) return;
  chrome.storage.local.remove(STORAGE_KEY);
  blockList = [];
  render();
});

init();
