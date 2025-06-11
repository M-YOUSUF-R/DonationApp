const submitButton = document.getElementById("submit-donation");
const nameInput = document.getElementById("donator-name");
const descInput = document.getElementById("donation-description");
const locationInput = document.getElementById("donation-location");
const imageInput = document.getElementById("donation-image");
const snackbar = document.getElementById("snackbar");

// Replace with your deployed Google Apps Script URL
const scriptURL =
  "https://script.google.com/macros/s/AKfycby9iyICdYr7hnPXZwIpjWIY9U4ePksP_mAFQ2hZUcr1ROugvYwfC5X1CQca0f04Sv1B6w/exec";

// Form validation
function validateForm() {
  const isValid =
    nameInput.value.trim() &&
    descInput.value.trim() &&
    locationInput.value.trim();
  submitButton.disabled = !isValid;
}

// Show snackbar notification
function showSnackbar(message, duration = 3000) {
  snackbar.textContent = message;
  snackbar.classList.add("show");
  setTimeout(() => snackbar.classList.remove("show"), duration);
}

// Event listeners for validation
[nameInput, descInput, locationInput].forEach((input) => {
  input.addEventListener("input", validateForm);
});

// Handle form submission
submitButton.addEventListener("click", async (e) => {
  e.preventDefault();

  if (submitButton.disabled) return;

  submitButton.disabled = true;
  const originalText = submitButton.innerHTML;
  submitButton.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Processing...';

  try {
    const formData = {
      name: nameInput.value.trim(),
      description: descInput.value.trim(),
      location: locationInput.value.trim(),
      image: "",
    };

    // Process image if available
    if (imageInput.files[0]) {
      if (imageInput.files[0].size > 5 * 1024 * 1024) {
        throw new Error("Image size exceeds 5MB limit");
      }

      formData.image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result.split(",")[1]);
        reader.readAsDataURL(imageInput.files[0]);
      });
    }

    const response = await fetch(scriptURL, {
      redirect: "follow",
      method: "POST",
      body: JSON.stringify(formData),
      headers: {
        "Content-Type": "text/plain;charset=utf-8",
      },
    });

    const result = await response.json();
    console.log(result);

    if (result.status === "error") throw new Error(result.message);

    showSnackbar("Donation submitted successfully!", 5000);

    // Reset form
    nameInput.value = "";
    descInput.value = "";
    locationInput.value = "";
    imageInput.value = "";
    document.getElementById("imagePreview").style.display = "none";
  } catch (error) {
    console.error("Submission error:", error);
    showSnackbar(error.message || "Submission failed. Please try again.", 5000);
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalText;
  }
});

// Image preview handler
imageInput.addEventListener("change", function () {
  const file = this.files[0];
  const preview = document.getElementById("imagePreview");

  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      preview.src = e.target.result;
      preview.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    preview.src = "";
    preview.style.display = "none";
  }

  validateForm();
});

// Initialize form validation
validateForm();
