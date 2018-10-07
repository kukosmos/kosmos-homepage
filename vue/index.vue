const msg_list = [
  "Hello, world!",
  "KOrea univ. Software MaestrOS",
  "Eat, Code, Sleep"
  /* please fill in messages */
];

const body = new Vue({
  el: "#body",
  data: {
    title: '&nbsp',
    msg: '&nbsp'
  },
  methods: {
    triggerMessage: function() {
      setInterval(() => {
        this.msg = msg_list[Math.floor(Math.random() * msg_list.length)];
      }, 3000);
    },
    triggerShorten: function() {
      this.title = 'KOrea university Software MaestrOS';
      setTimeout(() => {
        this.title = 'KOSMOS';
        setTimeout(() => {
          this.msg = msg_list[0];
          this.triggerMessage();
        }, 2000);
      }, 4000);
    }
  }
});
