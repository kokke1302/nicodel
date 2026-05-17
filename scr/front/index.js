/**
 * index.js — コンテントスクリプト
 * ニコニコ動画のタイムラインから指定ユーザーの投稿を非表示にする
 */

const SENDER_NAME_SELECTOR = ".TimelineItem-senderName";
const TIMELINE_ITEM_SELECTOR = ".TimelineItem.Timeline-item.TimelineItem_video";
const TARGET_NODE_ID = "UserPage-app";
const STORAGE_KEY = "nicodel_block_list";

/** ストレージからブロックリストを読み込む */
async function loadBlockList() {
  const storage = await chrome.storage.local.get(STORAGE_KEY);
  return storage[STORAGE_KEY] ?? [];
}

/** ブロック対象の投稿要素を取得して削除する */
function removeBlockedItems(blockList) {
  const items = document.querySelectorAll(TIMELINE_ITEM_SELECTOR);

  items.forEach((item) => {
    const senderEl = item.querySelector(SENDER_NAME_SELECTOR);
    if (!senderEl) return;

    const senderName = senderEl.innerText.trim();
    if (blockList.includes(senderName)) item.remove();
  });
}

async function init() {
  const blockList = await loadBlockList();

  const observer = new MutationObserver(() => {
    removeBlockedItems(blockList);
  });

  const targetNode = document.getElementById(TARGET_NODE_ID);
  if (!targetNode) {
    console.warn(`[nicodel] Target node #${TARGET_NODE_ID} not found.`);
    return;
  }

  observer.observe(targetNode, {
    attributes: true,
    childList: true,
    subtree: true,
  });

  // 初回実行
  removeBlockedItems(blockList);
}

init();
