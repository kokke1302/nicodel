const li = document.getElementById("upList");
const form = document.getElementById("newName");
const addname = document.getElementById("name");
const reset = document.getElementById("reset");
let setting = {};
let list = [];

function del(index){
	list = list.filter(n => n !== list[index]);

	setting = {up: list}
	chrome.storage.local.set(setting);
	chdiv();
}

function chdiv(){
	while(li.firstElementChild) li.removeChild(li.firstElementChild);

	list.forEach((up, index)=>{
		let block = document.createElement("tr");
		let upname = document.createElement("td");
		let tdbtn = document.createElement("td");
		let btn = document.createElement("div");
		btn.classList.add("btnX");

		let str = "upblock" + index;
		btn.addEventListener("click", ()=>{del(index)});
		btn.textContent = "X";
		upname.textContent = up;
		block.id = str;

		block.appendChild(upname);
		tdbtn.appendChild(btn);
		block.appendChild(tdbtn);
		li.appendChild(block);
	})
}

async function first(){
	setting = await chrome.storage.local.get();
	if(setting.up!=null) list = setting.up;
	chdiv();
}

first();

form.addEventListener("submit", (e)=>{
	e.preventDefault();

	if(list.indexOf(addname.value)===-1 && addname.value!="") list.push(addname.value);
	setting = {up: list}
	chrome.storage.local.set(setting);
	addname.value = null;
	chdiv();
})

reset.addEventListener("click", ()=>{
	chrome.storage.local.clear();
	setting = {};
	list = [];
	chdiv();
})
