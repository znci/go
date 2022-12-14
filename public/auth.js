const ui = new firebaseui.auth.AuthUI(firebase.auth())

// 2) These are our configurations.
const uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult(authResult, redirectUrl) {
	  console.log(authResult)
      return true
    },
    uiShown() {
      document.getElementById("loader").style.display = "none"
    },
  },
  signInFlow: "popup",
  signInSuccessUrl: "signedIn",
  signInOptions: [
    firebase.auth.GitHubAuthProvider,
    // Additional login options should be listed here
    // once they are enabled within the console.
  ],
}

ui.start("firebaseui-auth-container", uiConfig)

