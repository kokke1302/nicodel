let lists = [];
let aleng = 0;

async function first(){
	const setting = await chrome.storage.local.get();
	if(setting.up!=null) lists = setting.up;
}

const callback = ()=>{
	const a = document.getElementsByClassName("TimelineItem-senderName");
	if(a.length>aleng){
		aleng = a.length;

		const div = document.getElementsByClassName("TimelineItem Timeline-item TimelineItem_video");
		let delnum = [];

		const ar = Array.from(a);
		ar.forEach((name, index)=>{
			lists.forEach((delname)=>{
				if(name.innerText==delname) delnum.unshift(index);
			})
		})

		delnum.forEach((index)=>{
			div[index].remove();
		})
	}
}

// 動的DOM更新リスナー
const observer = new MutationObserver(callback);
// 変更を監視するノードを選択
const targetNode = document.getElementById("UserPage-app");
// (変更を監視する) オブザーバーのオプション
const config = { attributes: true, childList: true, subtree: true };
observer.observe(targetNode, config);

first();