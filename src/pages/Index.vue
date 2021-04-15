<template>
  <Layout>
    <div class="container">
      <div class="row mb-4">
        <div class="col">
          <h1>Postal Code to LatLng Converter</h1>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col">
          <label for="textArea"
            >Input multiple addresses on separate lines</label
          >
          <textarea
            v-model="textArea"
            id="textArea"
            class="form-control"
            rows="3"
          ></textarea>
        </div>
      </div>

      <div class="row mb-4">
        <div class="col">
          <p class="lead">
            <strong>Note:</strong> Each request costs $0.005 ($5/1k), so please
            use somewhat sparingly.
          </p>
          <button v-on:click="geocode" class="btn btn-warning">
            Convert to LatLng
          </button>
        </div>
      </div>

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
var geocoder = require("google-geocoder");
export default {
  data() {
    return {
      textArea: "",
      latLngs: [],
      copyText: "Copy to clipboard",
    };
  },
  methods: {
    geocode() {
      const _self = this;
      var geo = geocoder({
        key: process.env.GRIDSOME_GEOCODE_KEY,
      });

      // Reset the latLngs
      _self.latLngs = [];

      // Note that this will iterate over EVERY line in the textarea
      _self.addresses.forEach((address) => {
        if (address.length >= 6) {
          // Only attempt geocoding if address is at least a postal code's length (6+ chars)
          geo.find(address, function(err, res) {
            if (!err) {
              _self.latLngs.push(res[0].location);
            } else {
              console.log(err);
            }
          });
        } else {
          console.log("Address provided too short: " + address);
        }
      });
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
  computed: {
    addresses() {
      return this.textArea.split("\n");
    },
  },
};
</script>

<style>
body {
  padding: 50px 0;
}
</style>
