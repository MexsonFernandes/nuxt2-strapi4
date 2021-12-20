import defu from 'defu'
import { resolve } from 'pathe'
import { defineNuxtModule, addPlugin } from '@nuxt/kit'
import type { Nuxt } from '@nuxt/schema'
import type { StrapiOptions } from './types'

export default defineNuxtModule<StrapiOptions>({
  name: '@nuxtjs/strapi',
  configKey: 'strapi',
  defaults: {
    url: 'http://localhost:1337',
    prefix: '/api',
    version: 'v4'
  },
  setup (_options: StrapiOptions, nuxt: Nuxt) {
    // Default runtimeConfig
    const strapiConfig = nuxt.options.publicRuntimeConfig.strapi = defu({ url: process.env.STRAPI_URL }, _options)

    // Make sure url is set
    if (!strapiConfig.url) {
      throw new Error('Missing `STRAPI_URL` in `.env`')
    }

    // Add plugin to load user before bootstrap
    addPlugin(resolve(__dirname, './plugins/strapi'))

    // Add strapi composables
    nuxt.hook('autoImports:dirs', (dirs) => {
      dirs.push(resolve(__dirname, './composables'))
    })
  }
})

export * from './types'

declare module '@nuxt/schema' {
  interface ConfigSchema {
    publicRuntimeConfig?: {
      strapi?: StrapiOptions
    }
  }
  interface NuxtConfig {
    strapi?: StrapiOptions
  }
  interface NuxtOptions {
    strapi?: StrapiOptions
  }
}
