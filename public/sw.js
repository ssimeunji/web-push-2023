self.addEventListener("install", function (e) {
	console.log("fcm sw install..");
	self.skipWaiting();
});

self.addEventListener("activate", function (e) {
	console.log("fcm sw activate..");
});

self.addEventListener("push", (event) => {
	if (!(self.Notification && self.Notification.permission === "granted")) {
		return;
	}

	const data = event.data?.json() ?? {};
	console.log("push:", data);
	const title = data.title || "Web Push";
	const message = data.body || "Web Push Test";
	const image =
		data.image || "img/iu.png";
	const icon =
		data.icon || "img/cat.png";

	const options = {
		title: title,
		body: message,
		//badge: "https://webpush-react-project.web.app/img/icon.png", //컴퓨터 엣지, 크롬 안나옴, 안드로이드 나옴
		image: image,
		icon: icon,
	};

	event.waitUntil(
		self.registration.showNotification(title, options).then(() => {
			self.clients.matchAll().then((clients) => {
				clients.forEach((client) => {
					client.postMessage({
						type: "pushEvent",
						payload: {
							title: title,
							body: options.body,
							image: options.image,
							icon: options.icon
						},
					});
				});
			});
		})
	);
});

self.onnotificationclick = (event) => {
	console.log("On notification click: ", event.notification.tag);
	event.notification.close();

	// This looks to see if the current is already open and
	// focuses if it is
	event.waitUntil(
		clients
			.matchAll({
				type: "window",
			})
			.then((clientList) => {
				for (const client of clientList) {
					if (
						client.url === "https://webpush-react-project.web.app/" &&
						"focus" in client
					)
						return client.focus();
				}
				if (clients.openWindow)
					return clients.openWindow("https://webpush-react-project.web.app/");
			})
	);
};
