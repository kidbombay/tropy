'use strict'

const assert = require('assert')
const { Ontology, Template } = require('../../../lib/common/ontology')
const mod = require('../../../lib/models/ontology')
const { join } = require('path')

const created = '2019-03-02 21:01:44'

module.exports = {
  async up(tx) {
    const files = [
      join(Ontology.base, '..', 'ttp', 'generic.ttp'),
      join(Ontology.base, '..', 'ttp', 'correspondence.ttp'),
      join(Ontology.base, '..', 'ttp', 'dc.ttp'),
      join(Ontology.base, '..', 'ttp', 'photo.ttp'),
      join(Ontology.base, '..', 'ttp', 'selection.ttp')
    ]

    const isProtected = true

    for (const file of files) {
      const {
        '@id': id,
        type,
        name,
        version,
        creator,
        description,
        field: fields
      } = await Template.open(file)

      assert(id != null, 'missing template id')
      assert(name != null, 'missing template name')
      assert(type != null, 'missing template type')

      await mod.template.create(tx, {
        id, type, name, version, created, creator, description, isProtected
      })

      if (fields != null && fields.length > 0) {
        await Promise.all([
          mod.template.field.add(tx, id, ...fields)
        ])
      }
    }
  }
}
