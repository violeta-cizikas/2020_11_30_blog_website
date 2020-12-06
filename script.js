// CREATE BLOG WEBSITE
//turi buti validacijos

// Website should have these pages:
// REGISTER USER PAGE - page when user has to register
// USER LOGIN PAGE - page where user logs in and gets secret key (for further operations)
// ALL BLOG POSTS PAGE - page where all blog posts are visible (could be main page - index page)
// SINGLE POST PAGE - page which opens when single post is selected
// PARTICULAR USER POSTS PAGE - page which opens when you choose to see particular user posts
// PAGE FOR POST EDITING - page which opens when i click edit button on post i own

// Website should have these validations:
// when registering new user inputs should be validated in front-end (try sending random stuff to test api)
// when logging in there should also be validations depending on errors received from back-end
// when creating new post
// when updating post

// website should have these additional functions:
// some kind of modal pops up and asks for confirmation when user tries to delete own post
// modal pops up and asks for confirmation when user edits existing post
// there should be possibility to filter posts by date
// index page should look like - https://coney.qodeinteractive.com/pinterest-home/
// whole website styles should also be as close to example as possible
// please notice - only index page is required to look exact as example
// other pages has to have similar style but structure is up to you creative minds
// semantic tags should be used in html
// code shoulde be pushed to github and exported as static web page

// API DOCUMENTATION

// GET - REQUESTS

// get all posts
// http://167.99.138.67:1111/getallposts

// get particular user posts
// http://167.99.138.67:1111/getuserposts/:name
// put user name instead of ":name"

// get particular post
// http://167.99.138.67:1111/getsinglepost/:name/:id'
// put user name instead of ":name" and post id instead of ":id"

// POST - REQUESTS

// create new user
// http://167.99.138.67:1111/createaccount
// send JSON object with these keys:
// name, passwordOne, passwordTwo

// login to get your secret key
// http://167.99.138.67:1111/login
// send JSON object with these keys:
// name, password

// create new post (have to have secret key)
// http://167.99.138.67:1111/createpost
// send object JSON object with these keys:
// secretKey, title, image, description

// update existing post (have to have secret key)
// http://167.99.138.67:1111/updatepost
// send JSON object with these keys:
// secretKey, title, image, description, id (id stands for post id)

// delete existing post (have to have secret key)
// http://167.99.138.67:1111/deletepost
// send JSON object with these keys:
// secretKey, id (id stands for post id)

/////////////////////////////////////////////////////////////////////////////////////////////////////
// pgr menu:
// 1.home (index.html) _ bus rodomi visi postai:
// ALL BLOG POSTS PAGE
// 2. login (login.html):
// USER LOGIN PAGE
// 3. register.html:
// REGISTER USER PAGE
// 4. SINGLE POST PAGE (nebus pgr. menu / is home eis i SINGLE POST PAGE) _ post.html.
// 5. PAGE FOR POST EDITING (nebus pgr. menu / esant jame ir paspaudus redaguoti straipsni - eis i PAGE FOR POST EDITING)
// 6. PARTICULAR USER POSTS PAGE (tam tikro vartotojo postu perziura / pgr. menu nebus,
// bet prie kiekvieno posto bus autorius / paspaudus autoriu - tai bus kaip linkas i PARTICULAR USER POSTS PAGE) _ userposts.html
/////////////////////////////////////////////////////////////////////////////////////////////////////

function register(event) {
	let form = document.getElementById("registerForm");
	let formErrors = document.getElementById("formErrors");
	let name = form.querySelector("input[name='name']").value;
	let passwordOne = form.querySelector("input[name='passwordOne']").value;
	let passwordTwo = form.querySelector("input[name='passwordTwo']").value;

	let user = {
		name: name,
		passwordOne: passwordOne,
		passwordTwo: passwordTwo,
	};

	formErrors.innerHTML = "";
	if (name.length === 0) {
		formErrors.innerHTML = "please input your name";
		return; //uzbaigta f-ja
	} else if (passwordOne.length === 0) {
		formErrors.innerHTML = "please input your password";
		return;
		// (/\d/g (pradzia, skaicius, pabaiga, regexp'o flag'ai)) - regexp (regular expression) miniatskira kalba skirta stringu strukturos tikrinimui
	} else if (!/\d/g.test(passwordOne)) {
		formErrors.innerHTML = "password should have atleast one number";
		return;
	} else if (!/[a-z]/g.test(passwordOne)) {
		formErrors.innerHTML = "password should have atleast one lower case letter";
		return;
	} else if (!/[A-Z]/g.test(passwordOne)) {
		formErrors.innerHTML = "password should have atleast one upper case letter";
		return;
	} else if (passwordOne.length < 8) {
		formErrors.innerHTML = "password should have atleast 8 symbols";
		return;
	} else if (passwordOne !== passwordTwo) {
		formErrors.innerHTML = "passwords don't match";
		return;
	}

	fetch("http://167.99.138.67:1111/createaccount", {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			formErrors.innerHTML = data.message;
		});
}

function login(event) {
	let form = document.getElementById("loginForm");
	let formErrors = document.getElementById("formErrors");
	let name = form.querySelector("input[name='name']").value;
	let password = form.querySelector("input[name='password']").value;
	let user = {
		name: name,
		password: password,
	};

	fetch("http://167.99.138.67:1111/login", {
		method: "POST",
		mode: "cors",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(user),
	})
		.then((res) => res.json())
		.then((data) => {
			console.log(data);
			formErrors.innerHTML = data.message;
			if (data.secretKey) {
				localStorage.secretKey = data.secretKey;
				localStorage.userName = name;
			}
		});
}
// !!! sio beckend'o url nenaudoju, nes visa post'a irasau i localStorage !!!

// get particular post
// http://167.99.138.67:1111/getsinglepost/:name/:id'
// put user name instead of ":name" and post id instead of ":id"
let posts;
let body = document.getElementsByTagName("body")[0];

function goToPost(id) {
	body.className += " fadeout"; //istirpimas
	localStorage.post = JSON.stringify(
		posts.find(function (post) {
			return post.id === id;
		})
	);
	localStorage.postEdit = "";
	setTimeout(function () {
		window.location = "post.html";
	}, 2000);
	return false;
}

function goToPage(url) {
	body.className += " fadeout";
	setTimeout(function () {
		window.location = url;
	}, 2000);
	return false;
}

if (body.className.indexOf("pageHome") > -1) {
	function getPosts() {
		let mainContent = document.getElementsByClassName("mainContent")[0];
		fetch("http://167.99.138.67:1111/getallposts")
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				posts = data.data;
				let dates = {
					// {} - zymimas tuscias objektas(pvz.: sukurimo metu - title: 'sdasd')
				};
				// pvz.: po sukurimo i objekta irasyti naujus property'cius dates.title = 'sddsds', dates['title'] = 'asdsaa'

				//Each - panasiai kaip map (ciklas per masyva), o antras data - masyvas griztantis is backend'o
				data.data.forEach((post) => {
					//new Date - JS datos klases standartas ir esant backtick'u viduje, - paverciamas i string'a
					let date = new Date(post.timestamp);
					const monthNames = [
						"January",
						"February",
						"March",
						"April",
						"May",
						"June",
						"July",
						"August",
						"September",
						"October",
						"November",
						"December",
					];
					dates[`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`] = true;
					let dateFormat = `${
						monthNames[date.getMonth()]
					} ${date.getDate()}, ${date.getFullYear()}`;
					mainContent.innerHTML += `<div class="post short">
				<img src="${post.image}" alt=""/>
				<span>${dateFormat}</span> 
				<h1>${post.title}</h1>
				<p>${post.description}</p>
				<a onclick="goToPost('${post.id}')">READ MORE</a>
				<i class="fab fa-pinterest" onclick="clickpinterest()"></i>
				<i class="fab fa-twitter" onclick="clicktwitter()"></i>
				<i class="fab fa-facebook-f" onclick="clickfacebook()"></i>
								
				</div>`;
				});
				console.log(dates);
				// sukiamas datu pasirinkimas
				let dateSelect = document.getElementById("dateSelect");
				dateSelect.innerHTML = "<option value='all'>all</option>";
				Object.keys(dates).forEach((date) => {
					dateSelect.innerHTML += `<option value="${date}">${date}</option>`; //naudojamas, tik html <select></select> viduje ir reiskia, tik viena pasirinkima, kuri galima paspausti
				});
			});
	}

	getPosts();
}

function clickfacebook() {
	window.open(
		"https://www.facebook.com/login.php?skip_api_login=1&api_key=966242223397117&signed_next=1&next=https%3A%2F%2Fwww.facebook.com%2Fsharer.php%3Fu%3Dhttps%253A%252F%252Fconey.qodeinteractive.com%252F2016%252F12%252F14%252Fbest-design-schools-of-2016%252F&cancel_url=https%3A%2F%2Fwww.facebook.com%2Fdialog%2Fclose_window%2F%3Fapp_id%3D966242223397117%26connect%3D0%23_%3D_&display=popup&locale=en_GB",
		"_blank",
		"toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
	);
}

function clicktwitter() {
	window.open(
		"https://twitter.com/login",
		"_blank",
		"toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
	);
}

function clickpinterest() {
	window.open(
		"https://www.pinterest.com/pin/create/button/?url=https%3A%2F%2Fconey.qodeinteractive.com%2F2016%2F12%2F14%2Fhome-office-decoration-tips%2F&description=Home%20Office%20Decoration%20Tips&media=https%3A%2F%2Fconey.qodeinteractive.com%2Fwp-content%2Fuploads%2F2016%2F12%2Fblog-s-p-img-1.jpg",
		"_blank",
		"toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500,width=400,height=400"
	);
}

function filterByDate() {
	let dateSelectValue = document.getElementById("dateSelect").value;
	let mainContent = document.getElementsByClassName("mainContent")[0];
	mainContent.innerHTML = "";

	posts.forEach((post) => {
		let date = new Date(post.timestamp);
		const monthNames = [
			"January",
			"February",
			"March",
			"April",
			"May",
			"June",
			"July",
			"August",
			"September",
			"October",
			"November",
			"December",
		];
		if (
			dateSelectValue ===
				`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` ||
			dateSelectValue === "all"
		) {
			let dateFormat = `${
				monthNames[date.getMonth()]
			} ${date.getDate()}, ${date.getFullYear()}`;
			mainContent.innerHTML += `<div class="post short">
			<img src="${post.image}" alt=""/>
			<span>${dateFormat}</span> 
			<h1>${post.title}</h1>
			<p>${post.description}</p>
			<a onclick="goToPost('${post.id}')">READ MORE</a>
			</div>`;
		}
	});
}

if (body.classList.contains("pagePost")) {
	let mainContent = document.getElementsByClassName("dynamicContent")[0];
	//parse - atvirkstine stringify f-ja, kuri nuskaito json'inio formato string'a ir pavercia ji objektu
	let post = JSON.parse(localStorage.post);
	let date = new Date(post.timestamp);
	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December",
	];
	let dateFormat = `${
		monthNames[date.getMonth()]
	} ${date.getDate()}, ${date.getFullYear()}`;
	mainContent.innerHTML = `<div class="post full">
	<img src="${post.image}" alt=""/>
	<span>${dateFormat}</span> 
	<h1>${post.title}</h1>
	<p>${post.description}</p>
	<a onclick="goToUser('${post.username}')">${post.username}</a>
	</div>`;
}

if (body.classList.contains("pageUser")) {
	let mainContent = document.getElementsByClassName("mainContent")[0];
	let username = localStorage.viewUser;
	fetch("http://167.99.138.67:1111/getuserposts/" + username)
		.then((res) => res.json())
		.then((data) => {
			posts = data.data;
			data.data.forEach((post) => {
				let date = new Date(post.timestamp);
				const monthNames = [
					"January",
					"February",
					"March",
					"April",
					"May",
					"June",
					"July",
					"August",
					"September",
					"October",
					"November",
					"December",
				];
				let dateFormat = `${
					monthNames[date.getMonth()]
				} ${date.getDate()}, ${date.getFullYear()}`;
				mainContent.innerHTML += `<div class="post short">
				<img src="${post.image}" alt=""/>
				<span>${dateFormat}</span> 
				<h1>${post.title}</h1>
				<p>${post.description}</p>
				<a onclick="goToPost('${post.id}')">READ MORE</a>
				</div>`;
			});
		});
}
function goToUser(username) {
	localStorage.viewUser = username;
	window.location = "user.html";
}

let secretKey = localStorage.secretKey;

if (secretKey) {
	body.className += " loggedin";
}

function goToNewPost() {
	localStorage.postEdit = "new post";
	window.location = "post-edit.html";
}

function postEdit(event) {
	let form = document.getElementById("postEditForm");
	let formErrors = document.getElementById("formErrors");
	let title = form.querySelector("input[name='title']").value;
	let image = form.querySelector("input[name='image']").value;
	let description = form.querySelector("input[name='description']").value;

	let reason = localStorage.postEdit;
	if (reason === "new post") {
		let post = {
			title: title,
			image: image,
			description: description,
			secretKey: localStorage.secretKey,
		};
		fetch("http://167.99.138.67:1111/createpost", {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(post),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				formErrors.innerHTML = data.message;
			});
		//window.confirm - sukuria narsyklini modala
	} else if (window.confirm("Are you sure you want to update this post?")) {
		let post = {
			title: title,
			image: image,
			description: description,
			secretKey: localStorage.secretKey,
			id: JSON.parse(localStorage.post).id,
		};
		fetch("http://167.99.138.67:1111/updatepost", {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(post),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				formErrors.innerHTML = data.message;
			});
	}
}

if (body.classList.contains("pagePostEdit") || body.classList.contains("pagePost")) {
	let post = JSON.parse(localStorage.post);
	let userName = localStorage.userName;
	let reason = localStorage.postEdit;

	if (post.username === userName) {
		let actions = document.getElementsByClassName("actions")[0];
		actions.style.display = "block"; //tampa matomas
		if (body.classList.contains("pagePostEdit") && reason === "new post") {
			actions.className += " newPost";
		}
	} else if (reason === "new post") {
		let actions = document.getElementsByClassName("actions")[0];
		actions.style.display = "block"; //tampa matomas
	}
}

if (body.classList.contains("pagePostEdit")) {
	let mainContent = document.getElementsByClassName("mainContent")[0];
	let post = JSON.parse(localStorage.post);
	let reason = localStorage.postEdit;
	if (reason === "edit") {
		let form = document.getElementById("postEditForm");
		form.querySelector("input[name='title']").value = post.title;
		form.querySelector("input[name='image']").value = post.image;
		form.querySelector("input[name='description']").value = post.description;
	}
}
function editPost() {
	localStorage.postEdit = "edit";
	window.location = "post-edit.html";
}
function deletePost() {
	// confirm - issoka langas su mygtukais ok ir cancel
	if (window.confirm("Are you sure you want to delete this post?")) {
		fetch("http://167.99.138.67:1111/deletepost", {
			method: "POST",
			mode: "cors",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				id: JSON.parse(localStorage.post).id,
				secretKey: localStorage.secretKey,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				window.location = "index.html";
			});
	}
}
function cancelEditPost() {
	window.location = "index.html";
}

function backToTop() {
	window.scrollTo(window.scrollX, 0);
}
function updateScroll(event) {
	let scrollPosition = window.scrollY;
	let documentHeight = document.body.scrollHeight;
	let backToTop = document.getElementsByClassName("backToTop")[0];
	if (backToTop) {
		if (scrollPosition > 200) {
			backToTop.style.display = "flex";
		} else {
			backToTop.style.display = "none";
		}
	}
}
document.addEventListener("scroll", updateScroll);
updateScroll();
