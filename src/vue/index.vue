var msg_list = [
  'Hello, world!',
  'KOrea univ. Software MaestrOS',
  /* please fill in messages */
]

var body = new Vue ({
  el: '#body',
  data: {
    shorten: false,
    msg: ''
  },
  methods: {
    triggerMessage: function() {
      setInterval(() => {
        this.msg = msg_list[Math.floor((Math.random() * msg_list.length))];
      }, 3000);
    },
    triggerShorten: function() {
      setTimeout(() => {
        this.shorten = true;
        setTimeout(() => {
          this.msg = msg_list[0];
          this.triggerMessage();
        }, 2000);
      }, 2000);
    }
  }
});