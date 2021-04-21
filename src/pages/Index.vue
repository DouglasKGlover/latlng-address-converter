<template>
  <Layout>
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>Postal Code to LatLng Converter</h1>
        </div>
      </div>

      <form>
        <div class="row mb-4">
          <div class="col">
            <label for="password">Password:</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              required
            />
            <p class="text-danger" v-if="passwordError">
              <small>Incorrect password.</small>
            </p>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <label for="textArea"
              >Input multiple addresses on separate lines:</label
            >
            <textarea
              v-model="textArea"
              id="textArea"
              class="form-control"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div class="row mb-4">
          <div class="col">
            <p class="lead">
              <strong>Note:</strong> Each request costs $0.005 ($5/1k), so
              please use somewhat sparingly.
            </p>
            <button @click.prevent="geocode" class="btn btn-warning">
              Convert to LatLng
            </button>
          </div>
        </div>
      </form>

      <hr v-if="latLngs != ''" />

      <div class="row mb-4" v-if="latLngs != ''">
        <div class="col-lg-3 mb-4">
          <h2>LatLng Values:</h2>
        </div>
        <div class="col">
          <button
            class="btn btn-outline-secondary mb-2"
            v-on:click="copyToClipboard()"
          >
            {{ copyText }}
          </button>
          <textarea
            name="latLngValues"
            id="latLngValues"
            class="form-control"
            rows="6"
            v-html="latLngs"
          ></textarea>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
export default {
  data() {
    return {
      password: "",
      passwordError: false,
      textArea: "",
      latLngs: [],
      copyText: "Copy to clipboard",
    };
  },
  methods: {
    async geocode(e) {
      e.preventDefault;
      const _self = this;
      const addresses = _self.textArea.split("\n");
      const submission = {
        password: _self.password,
        addresses: addresses,
      };

      // Reset form errors
      _self.passwordError = false;
      _self.latLngError = false;

      // Submit to the API
      await fetch("/api/geocode-addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submission),
      })
        .then((response) => response.text())
        .then((result) => {
          const jsonResult = JSON.parse(result);
          console.log(jsonResult);

          // Message errors if any
          if (jsonResult.error) {
            if (jsonResult.error.errorField == "password") {
              _self.passwordError = jsonResult.error.errorMessage;
            } else if (jsonResult.error.errorField == "latLng") {
              _self.latLngError = jsonResult.error.errorMessage;
            }
          }

          // If no errors, provide LatLng values
          // (TODO)
        })
        .catch((error) => console.log("error", error));
    },
    copyToClipboard() {
      var copyText = document.getElementById("latLngValues");
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      document.execCommand("copy");

      this.copyText = "Copied to clipboard!";
      setTimeout(() => {
        this.copyText = "Copy to clipboard";
      }, 1500);
    },
  },
};
</script>

<style>
body {
  padding: 50px 0;
}
</style>
