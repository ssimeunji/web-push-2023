import "./App.css";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

function App() {
	const [pushToken, setPushToken] = useState("");

	const handlePushEvent = (event) => {

		if (event.data && event.data.type === "pushEvent") {
			const { title, body, image, icon } = event.data.payload;
			const handleButtonClick = (event) => {
				event.target.parentElement.remove();
			};

			const popupElement = (
				<div className="Popup">
					<img className="Popup_img" src={image} />
					<div className="Popup_content">
						<img className="Popup_icon" src={icon} />
						<div className="Popup_text">
							<h4>{title}</h4>
							<label>{body}</label>
						</div>
					</div>
					<button onClick={handleButtonClick}>&times;</button>
				</div>
			);

			ReactDOM.createPortal(popupElement, document.body);
		}
	};
	// const handlePushEvent = (event) => {

	// 	if (event.data && event.data.type === "pushEvent") {
	// 		const { title, body, image, icon } = event.data.payload;
	// 		const popupDiv = document.createElement("div");
	// 		popupDiv.innerHTML = `
	// <div class="Popup">
	// 			<img class="Popup_img" src="${image}" />
	// 			<div class="Popup_content">
	// 				<img class="Popup_icon" src="${icon}" />
	// 				<div class="Popup_text">
	// 					<h4>${title}</h4>
	// 					<label>${body}</label>
	// 				</div>
	// 			</div>

	// 				<button onClick="this.parentElement.remove()">&times;</button>

	// 		</div>
	// `;
	// 		document.body.appendChild(popupDiv);
	// 	}
	// };

	useEffect(() => {
		navigator.serviceWorker.addEventListener("message", handlePushEvent);
	}, []);

	// async function getToken() {
	// 	const swRegistration = await navigator.serviceWorker.ready;
	// 	const push = await swRegistration.pushManager.subscribe({
	// 		userVisibleOnly: true,
	// 		applicationServerKey:
	// 			"BDCuwEJaNg8f8UtTnD4yylmCuWsTCxxVoA-VXWExkxtCDC8U4yadV3aEUptbMvid_ctsDevpP-0NH40V-6AfW8k",
	// 	});
	// 	console.log(JSON.stringify(push));
	// 	setPushToken(JSON.stringify(push));
	// }

	async function getToken() {
		const swRegistration = await navigator.serviceWorker.ready;

		// 기존 구독 해지
		// const currentSubscription =
		// 	await swRegistration.pushManager.getSubscription();
		// if (currentSubscription) {
		// 	await currentSubscription.unsubscribe();
		// }

		const push = await swRegistration.pushManager.subscribe({
			userVisibleOnly: true,
			applicationServerKey:
				"BDCuwEJaNg8f8UtTnD4yylmCuWsTCxxVoA-VXWExkxtCDC8U4yadV3aEUptbMvid_ctsDevpP-0NH40V-6AfW8k",
		});
		console.log(JSON.stringify(push));
		setPushToken(JSON.stringify(push));
	}

	const handleSubmit = async (e) => {
		if (!pushToken) {
			alert("토큰을 받아오지 못했습니다. 토큰 값을 확인해주세요.");
			return;
		}

		// 토큰 값을 서버로 전송
		const response = await fetch(
			"https://6543-183-101-208-60.ngrok-free.app/api/v1/pushset",
			// "http://localhost:8080/api/v1/pushset",
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: pushToken,
			}
		);

		// 서버로부터의 응답 처리
		if (response.ok) {
			const data = await response.json();
			console.log("서버 응답:", data);
			// 여기에서 응답 데이터를 처리하도록 코드를 작성하세요.
		} else {
			console.log("서버 응답이 실패했습니다.", response.status);
		}
	};

	return (
		<div style={{ padding: "20px" }}>
			<h1>웹 푸시 테스트 4</h1>
			<p>먼저 알림 권한이 허용되어야 합니다.</p>
			<button
				onClick={getToken}
				style={{ padding: "10px", width: "200px", height: "50px" }}
			>
				토큰 받기
			</button>
			<p>
				토큰 :<br />
				{pushToken}
			</p>
			<button
				onClick={handleSubmit}
				style={{ padding: "10px", width: "200px", height: "50px" }}
			>
				토큰 서버 전송
			</button>

		</div>
	);
}

export default App;
