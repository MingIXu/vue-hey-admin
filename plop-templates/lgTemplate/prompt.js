const { notEmpty } = require('../utils.js')

module.exports = {
  description: 'generate a lgTemplate',
  prompts: [{
    type: 'input',
    name: 'file',
    message: 'view file please',
    validate: notEmpty('file')
  },
  {
    type: 'input',
    name: 'name',
    message: 'view name please',
    validate: notEmpty('name')
  },
  {
    type: 'input',
    name: 'api',
    message: 'view api please',
    validate: notEmpty('api')
  },
  {
    type: 'confirm',
    name: 'wantIndex',
    message: 'Do you want index.js?'
  },
  {
    type: 'checkbox',
    name: 'blocks',
    message: 'Blocks:',
    choices: [{
      name: '<template>',
      value: 'template',
      checked: true
    },
    {
      name: '<script>',
      value: 'script',
      checked: true
    },
    {
      name: 'style',
      value: 'style',
      checked: true
    }
    ],
    validate(value) {
      if (value.indexOf('script') === -1 && value.indexOf('template') === -1) {
        return 'View require at least a <script> or <template> tag.'
      }
      return true
    }
  }
  ],
  actions: data => {
    const name = '{{name}}'
    const file = '{{file}}'
    const actions = [{
      type: 'add',
      path: `src/views/${file}/${name}.vue`,
      templateFile: 'plop-templates/lgTemplate/template.hbs',
      data: {
        name: name,
        template: data.blocks.includes('template'),
        script: data.blocks.includes('script'),
        style: data.blocks.includes('style')
      }
    },
    {
      type: 'add',
      path: `src/views/${file}/columnsConst/modules/${name}Const.js`,
      templateFile: 'plop-templates/lgTemplate/columns.hbs'
    }]
    if (data.wantIndex) {
      actions.push({
        type: 'add',
        path: `src/views/${file}/columnsConst/index.js`,
        templateFile: 'plop-templates/lgTemplate/index.hbs'
      })
    }
    return actions
  }
}
