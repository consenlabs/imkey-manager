import Vue from 'vue'
import stepPage from '../../../src/renderer/views/steps/step'

describe('step.vue', () => {
  it('should render correct contents', () => {
    const vm = new Vue({
      el: document.createElement('div'),
      render: h => h(stepPage)
    }).$mount()

    expect(vm.$el.querySelector('.title').textContent).to.contain('连接')
  })
})
