document.addEventListener("DOMContentLoaded", function () {
  // Global variable to store the logged-in user
  let currentUser = null;

  // -------------------------
  // Voice Assistant Integration
  // -------------------------
  const startVoiceBtn = document.getElementById('startVoice');
  startVoiceBtn.addEventListener('click', startVoiceAssistant);

  // Initialize SpeechRecognition API (or vendor-prefixed version)
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.continuous = false;
  recognition.interimResults = false;

  // Ensure permission is granted only once
  navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
      console.log("Microphone access granted");
  }).catch((err) => {
      console.error("Microphone access denied", err);
  });

  let isListening = false;  // Track if recognition is already running

  function startVoiceAssistant() {
      if (!isListening) {
          isListening = true;
          recognition.start();
          updateResponse("Listening for your command...");
      }
  }

  recognition.onresult = function (event) {
      const userQuery = event.results[0][0].transcript.toLowerCase();
      updateResponse(`You said: ${userQuery}`);
      isListening = false; // Allow next recognition

      // Activate features based on recognized keywords
      if (userQuery.includes('reminder')) {
          openFeatureModal(
              'Medication Reminder',
              'This feature allows you to set and manage your medication reminders. [Interactive content can be added here.]'
          );
      } else if (userQuery.includes('symptom checker')) {
          openFeatureModal(
              'Symptom Checker',
              'This feature helps you check your symptoms and suggests possible conditions. [Interactive content can be added here.]'
          );
      } else if (userQuery.includes('appointment')) {
          openFeatureModal(
              'Appointment Scheduler',
              `<form id="appointmentForm">
                 <div class="form-control">
                   <label for="appointmentDate">Select Date:</label>
                   <input type="date" id="appointmentDate" required />
                 </div>
                 <div class="form-control">
                   <label for="appointmentTime">Select Time:</label>
                   <input type="time" id="appointmentTime" required />
                 </div>
                 <div class="form-control">
                   <label for="provider">Select Provider:</label>
                   <select id="provider" required>
                     <option value="">--Select Provider--</option>
                     <option value="Dr. Smith">Dr. Smith</option>
                     <option value="Dr. Jones">Dr. Jones</option>
                   </select>
                 </div>
                 <button type="submit">Schedule Appointment</button>
               </form>
               <div id="appointmentMessage" style="margin-top: 15px; font-weight: bold;"></div>`
          );

          setTimeout(() => {
              const appointmentForm = document.getElementById('appointmentForm');
              if (appointmentForm) {
                  appointmentForm.addEventListener('submit', function (e) {
                      e.preventDefault();
                      const appointmentDate = document.getElementById('appointmentDate').value;
                      const appointmentTime = document.getElementById('appointmentTime').value;
                      const provider = document.getElementById('provider').value;
                      const appointmentMessage = document.getElementById('appointmentMessage');

                      if (appointmentDate && appointmentTime && provider) {
                          appointmentMessage.innerHTML = `Appointment scheduled on ${appointmentDate} at ${appointmentTime} with ${provider}.`;
                      } else {
                          appointmentMessage.innerHTML = 'Please fill in all fields to schedule an appointment.';
                      }
                  });
              }
          }, 500);
      } else if (userQuery.includes('profile')) {
          if (currentUser) {
              openFeatureModal(
                  'My Profile',
                  `Username: ${currentUser}<br/>Additional profile information can be displayed here.`
              );
          } else {
              updateResponse("Please login to view your profile.");
              openLoginModal();
          }
      } else if (userQuery.includes('sos')) {
          openFeatureModal(
              'SOS Call',
              `<p><strong>Emergency SOS activated!</strong></p>
               <p>Please remain calm. Emergency services have been alerted.</p>`
          );
      } else {
          updateResponse("Sorry, I didn't understand that. Please try again.");
      }
  };

  recognition.onend = function () {
      isListening = false; // Reset flag when recognition ends
  };

  function speakResponse(text) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
  }

  function updateResponse(text) {
      const responseEl = document.getElementById('response');
      responseEl.innerHTML = text;
      speakResponse(text);
  }

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openFeatureModal(title, content) {
      modalBody.innerHTML = `<h2>${title}</h2>${content}`;
      modal.style.display = 'block';
  }

  modalCloseBtn.addEventListener('click', () => {
      modal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === modal) {
          modal.style.display = 'none';
      }
  });

  const loginModal = document.getElementById('loginModal');
  const loginModalCloseBtn = document.getElementById('loginModalCloseBtn');
  const loginBtn = document.getElementById('loginBtn');
  const loginForm = document.getElementById('loginForm');
  const greetingSection = document.getElementById('greetingSection');
  const usernameDisplay = document.getElementById('usernameDisplay');
  const logoutBtn = document.getElementById('logoutBtn');

  loginBtn.addEventListener('click', openLoginModal);

  function openLoginModal() {
      loginModal.style.display = 'block';
  }

  loginModalCloseBtn.addEventListener('click', () => {
      loginModal.style.display = 'none';
  });

  window.addEventListener('click', (event) => {
      if (event.target === loginModal) {
          loginModal.style.display = 'none';
      }
  });

  loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const usernameInput = document.getElementById('username').value.trim();
      const passwordInput = document.getElementById('password').value.trim();

      if (usernameInput && passwordInput) {
          currentUser = usernameInput;
          usernameDisplay.textContent = currentUser;
          greetingSection.style.display = 'block';
          loginModal.style.display = 'none';
          updateResponse(`Welcome, ${currentUser}!`);
      } else {
          updateResponse("Please enter both username and password.");
      }
  });

  logoutBtn.addEventListener('click', () => {
      currentUser = null;
      greetingSection.style.display = 'none';
      updateResponse("You have been logged out.");
  });

  document.getElementById('startVoice').addEventListener('click', startVoiceAssistant);
  document.getElementById('checkProfile').addEventListener('click', () => {
      if (currentUser) {
          openFeatureModal(
              'My Profile',
              `Username: ${currentUser}<br/>Additional profile information can be displayed here.`
          );
      } else {
          updateResponse("Please login to view your profile.");
          openLoginModal();
      }
  });

  document.getElementById('sosCall').addEventListener('click', () => {
      openFeatureModal(
          'SOS Call',
          `<p><strong>Emergency SOS activated!</strong></p>
           <p>Please remain calm. Emergency services have been alerted.</p>`
      );
  });
});
