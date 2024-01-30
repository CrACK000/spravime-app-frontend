<template>
  <panel-grid>

    <form method="post" @submit.prevent="updateLoginData" @keyup="checkLoginData">
      <panel divide="y">
        <panel-form>
          <div class="flex flex-col gap-6">
            <div>
              <label class="mb-1 block" for="email">Prihlasovací email</label>
              <input type="email" :class="[ getErrorLoginData('email') ? 'input-danger' : 'input', 'w-full']" id="email" v-model="loginData.email" placeholder="@" required>
              <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('email')" v-text="getErrorLoginData('email')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="username">Prihlasovací meno</label>
              <input type="text" :class="[ getErrorLoginData('username') ? 'input-danger' : 'input', 'w-full']" id="username" v-model="loginData.username" required>
              <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('username')" v-text="getErrorLoginData('username')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="mobile">Telefónne číslo</label>
              <input type="tel" class="input w-full" id="mobile" v-model="loginData.mobile" placeholder="+421 9xx xxx xxx">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorLoginData('mobile')" v-text="getErrorLoginData('mobile')"></div>
            </div>
          </div>
        </panel-form>
        <panel-form-actions>
          <template #left>
            Prihlasovacie údaje
          </template>
          <template #right>
            <button type="submit" class="form-secondary-button" v-if="loginData.changed" @click.prevent="setLoginData">
              Zrušiť
            </button>
            <button type="submit" class="form-button" :disabled="!loginData.changed || loginData.loading || loginData.errors.length">
              <template v-if="loginData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
              <template v-else>Uložiť</template>
            </button>
          </template>
        </panel-form-actions>
      </panel>
    </form>

    <form method="post" @submit.prevent="updateAdvancedData" @keyup="checkAdvancedData">
      <panel divide="y">
        <panel-form>
          <div class="flex flex-col gap-6">
            <div>
              <label class="mb-2 block" for="type">Typ účtu</label>
              <select :class="[ getErrorAdvancedData('type') ? 'input-danger' : 'input']" id="type" v-model="advancedData.type" @change="checkAdvancedData">
                <option value="normal">Klasický</option>
                <option value="company">Firma</option>
                <option value="worker">Živnostník</option>
              </select>
              <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('type')" v-text="getErrorAdvancedData('type')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="address">Lokalita</label>
              <input type="text" list="addressData" :class="[ getErrorAdvancedData('address') ? 'input-danger' : 'input', 'w-full']" id="address" v-model="advancedData.address" placeholder="Lokalita alebo PSČ">
              <div class="text-sm mt-2 flex items-center gap-1.5">
                <svg class="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 11h2v5m-2 0h4m-2.6-8.5h0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                </svg>
                Lokalita je viditeľná v profile iba pre firmy a živnostníkov.
              </div>
              <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('address')" v-text="getErrorAdvancedData('address') + 'asd'"></div>
              <datalist id="addressData">
                <option v-for="item in slovakData" :value="item.state+' '+item.place">{{ item.zipcode }}</option>
              </datalist>
            </div>
          </div>
        </panel-form>
        <panel-form v-if="advancedData.type !== 'normal'">
          <div class="flex flex-col gap-6">
            <div>
              <label class="mb-1 block" for="name">Meno</label>
              <input type="text" :class="[ getErrorAdvancedData('name') ? 'input-danger' : 'input', 'w-full']" id="name" v-model="advancedData.name">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('name')" v-text="getErrorAdvancedData('name')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="slogan">Slogan</label>
              <input type="text" :class="[ getErrorAdvancedData('slogan') ? 'input-danger' : 'input', 'w-full']" id="slogan" v-model="advancedData.slogan">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('slogan')" v-text="getErrorAdvancedData('slogan')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="sections">Sekcie</label>
              <select :class="[ getErrorAdvancedData('sections') ? 'input-danger' : 'input', 'w-full']" id="sections" v-model="advancedData.sections" multiple>
                <option v-for="section in allSections" :value="section.id">{{ section.title }}</option>
              </select>
              <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('sections')" v-text="getErrorAdvancedData('sections')"></div>
            </div>
          </div>
        </panel-form>
        <panel-form width="full" v-if="advancedData.type !== 'normal'">
          <div>
            <label class="mb-1 block" for="description">Popis</label>
            <textarea :class="[ getErrorAdvancedData('description') ? 'input-danger' : 'input', 'w-full']" rows="6" id="description" v-model="advancedData.description"></textarea>
            <div class="text-red-500 text-sm mt-2" v-if="getErrorAdvancedData('description')" v-text="getErrorAdvancedData('description')"></div>
          </div>
        </panel-form>
        <panel-form-actions>
          <template #left>
            Údaje vylepšeného profilu
          </template>
          <template #right>
            <button type="submit" class="form-secondary-button" v-if="advancedData.changed" @click.prevent="setAdvancedData">
              Zrušiť
            </button>
            <button type="submit" class="form-button" :disabled="!advancedData.changed || advancedData.loading || advancedData.errors.length">
              <template v-if="advancedData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
              <template v-else>Uložiť</template>
            </button>
          </template>
        </panel-form-actions>
      </panel>
    </form>

    <form @submit.prevent="updateSocialData" @keyup="checkSocialData">
      <panel divide="y">
        <panel-form>
          <div class="flex flex-col gap-6">
            <div>
              <label class="mb-1 block" for="facebook">Facebook</label>
              <input type="text" :class="[ getErrorSocialData('facebook') ? 'input-danger' : 'input', 'w-full']" id="facebook" v-model="socialData.facebook" placeholder="facebook.com/vasa-firma">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('facebook')" v-text="getErrorSocialData('facebook')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="instagram">Instagram</label>
              <input type="text" :class="[ getErrorSocialData('instagram') ? 'input-danger' : 'input', 'w-full']" id="instagram" v-model="socialData.instagram" placeholder="instagram.com/vasa-firma">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('instagram')" v-text="getErrorSocialData('instagram')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="tiktok">TikTok</label>
              <input type="text" :class="[ getErrorSocialData('tiktok') ? 'input-danger' : 'input', 'w-full']" id="tiktok" v-model="socialData.tiktok" placeholder="tiktok.com/@vasa-firma">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('tiktok')" v-text="getErrorSocialData('tiktok')"></div>
            </div>
            <div>
              <label class="mb-1 block" for="linkedin">Linkedin</label>
              <input type="text" :class="[ getErrorSocialData('linkedin') ? 'input-danger' : 'input', 'w-full']" id="linkedin" v-model="socialData.linkedin" placeholder="linkedin.com/in/vasa-firma">
              <div class="text-red-500 text-sm mt-2" v-if="getErrorSocialData('linkedin')" v-text="getErrorSocialData('linkedin')"></div>
            </div>
          </div>
        </panel-form>
        <panel-form-actions>
          <template #left>Sociálne siete</template>
          <template #right>
            <button type="submit" class="form-secondary-button" v-if="socialData.changed" @click.prevent="setSocialData">
              Zrušiť
            </button>
            <button type="submit" class="form-button" :disabled="!socialData.changed || socialData.loading || socialData.errors.length">
              <template v-if="socialData.loading"><i class="fa-solid fa-circle-notch fa-spin me-1"></i> Ukladá sa</template>
              <template v-else>Uložiť</template>
            </button>
          </template>
        </panel-form-actions>
      </panel>
    </form>

  </panel-grid>
</template>

<script setup lang="ts">
import {useMeta} from "vue-meta"
import Panel from "@/components/Panel.vue"
import PanelGrid from "@/components/PanelGrid.vue"
import PanelForm from "@/components/PanelForm.vue"
import PanelFormActions from "@/components/PanelFormActions.vue"
import {inject, onMounted, ref} from "vue"
import axios from "axios"
import { settings } from "@/plugins/config"
import type {Sections, Zipcodes} from "@/types/offers";
import categoriesData from "@/plugins/categories.json";
import skZipcodes from "@/plugins/zipcodes/sk.json";
import type {Auth, User} from "@/types/users";
import {useToast} from "primevue/usetoast";

useMeta({ title: 'Upraviť profil' })

const toast = useToast()

const auth = inject<Auth>('auth');
const user = ref(auth?.user as User)

const loginData = ref({
  email: '' as string,
  username: '' as string,
  mobile: '' as any,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})
const advancedData = ref({
  type: '' as 'company' | 'worker' | 'normal',
  address: '' as string,
  name: '' as string,
  sections: [] as any,
  slogan: '' as string,
  description: '' as string,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})
const socialData = ref({
  facebook: '' as string,
  instagram: '' as string,
  tiktok: '' as string,
  linkedin: '' as string,
  changed: false as boolean,
  loading: false as boolean,
  success: false as boolean,
  errors: [] as any,
})

const allSections = ref<Sections[]>(categoriesData.sections)
const slovakData = ref<Zipcodes[]>(skZipcodes)


const setLoginData = () => {
  loginData.value.errors = []
  loginData.value.changed = false
  loginData.value.email = user.value.email
  loginData.value.username = user.value.username
  loginData.value.mobile = user.value.mobile
}
const checkLoginData = () => {
  loginData.value.errors = []
  loginData.value.changed = !(loginData.value.email === user.value.email && loginData.value.username === user.value.username && loginData.value.mobile === user.value.mobile)

  validEmail(loginData.value.email)
  validUsername(loginData.value.username)
  validMobile(loginData.value.mobile)
}
const updateLoginData = () => {
  loginData.value.loading = true

  if (loginData.value.errors.length) return false

  const LoginData = loginData.value

  axios.post(settings.backend + '/api/profile/update/login-data', LoginData, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
        loginData.value.success = true
        loginData.value.changed = false
        user.value.email = loginData.value.email
        user.value.username = loginData.value.username
        user.value.mobile = loginData.value.mobile
      } else {
        loginData.value.errors = response.data.errors
        loginData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      loginData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      loginData.value.loading = false
      console.log('finally')
    })
}
const getErrorLoginData = (search: any) => {
  const emailError = loginData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const validEmail = (email: string) => {
  const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/
  if (emailRegex.test(email)) {
    return true
  } else {
    loginData.value.errors.push({where: 'email', message: 'Nesprávny formát emailu.'})
  }
}
const validUsername = (username: string) =>  {
  if (username.length >= 3){
    if (username.length < 60) {
      return true
    } else {
      loginData.value.errors.push({where: 'username', message: 'Používateľské meno môže obsahovať maximálne 60 znakov.'})
    }
  } else {
    loginData.value.errors.push({where: 'username', message: 'Používateľské meno musí obsahovať 3 a viac znakov.'})
  }
}
const validMobile = (mobile: string) => {
  if (mobile) {
    const mobileRegex = /^[+]\+?[1-9][0-9]{11,15}$/
    if (mobileRegex.test(mobile)) {
      return true
    } else {
      loginData.value.errors.push({where: 'mobile', message: 'Nesprávny formát tel. čísla.'})
    }
  } else {
    return true
  }
}
const setAdvancedData = () => {
  advancedData.value.errors = []
  advancedData.value.changed = false
  advancedData.value.type = user.value.type
  advancedData.value.address = user.value.address
  advancedData.value.name = user.value.name
  advancedData.value.sections = user.value.sections
  advancedData.value.slogan = user.value.slogan
  advancedData.value.description = user.value.description
}
const checkAdvancedData = () => {
  advancedData.value.errors = []
  advancedData.value.changed = !(
    advancedData.value.type === user.value.type &&
    advancedData.value.address === user.value.address &&
    advancedData.value.name === user.value.name &&
    advancedData.value.sections === user.value.sections &&
    advancedData.value.slogan === user.value.slogan &&
    advancedData.value.description === user.value.description
  )

  if (advancedData.value.type !== 'normal'){
    validName(advancedData.value.name)
  }
}
const getErrorAdvancedData = (search: any) => {
  const emailError = advancedData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const updateAdvancedData = () => {
  advancedData.value.loading = true

  if (advancedData.value.errors.length) return false

  const AdvancedData = advancedData.value

  if (AdvancedData.type === 'normal') {
    AdvancedData.name = ''
    AdvancedData.sections = []
    AdvancedData.slogan = ''
    AdvancedData.description = ''
  }

  axios.post(settings.backend + '/api/profile/update/advanced-data', AdvancedData, { withCredentials: true })
    .then((response) => {
      if (response.data.success === true) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: response.data.message, group: 'br', life: 5000 })
        advancedData.value.success = true
        advancedData.value.changed = false
        user.value.type = advancedData.value.type
        user.value.address = advancedData.value.address
        user.value.name = advancedData.value.name
        user.value.sections = advancedData.value.sections
        user.value.slogan = advancedData.value.slogan
        user.value.description = advancedData.value.description
      } else {
        advancedData.value.errors = response.data.errors
        advancedData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      advancedData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      advancedData.value.loading = false
      console.log('finally')
    })
}
const validName = (name: string) => {
  if (name) {
    if (name.length >= 3){
      if (name.length <= 50){
        return true
      } else {
        advancedData.value.errors.push({ where: 'name', message: 'Meno je príliš dlhé.' })
      }
    } else {
      advancedData.value.errors.push({ where: 'name', message: 'Meno je príliš krátke.' })
    }
  } else {
    advancedData.value.errors.push({ where: 'name', message: 'Meno musí byť vyplnené.' })
  }
}
const setSocialData = () => {
  socialData.value.errors = []
  socialData.value.changed = false
  socialData.value.facebook = <string>user.value.facebook
  socialData.value.instagram = <string>user.value.instagram
  socialData.value.tiktok = <string>user.value.tiktok
  socialData.value.linkedin = <string>user.value.linkedin
}
const checkSocialData = () => {
  socialData.value.errors = []
  socialData.value.changed = !(socialData.value.facebook === user.value.facebook && socialData.value.instagram === user.value.instagram && socialData.value.tiktok === user.value.tiktok && socialData.value.linkedin === user.value.linkedin)

  if (socialData.value.facebook.length) validURL(socialData.value.facebook, 'facebook')
  if (socialData.value.instagram.length) validURL(socialData.value.instagram, 'instagram')
  if (socialData.value.tiktok.length) validURL(socialData.value.tiktok, 'tiktok')
  if (socialData.value.linkedin.length) validURL(socialData.value.linkedin, 'linkedin')
}
const updateSocialData = () => {
  socialData.value.loading = true

  if (socialData.value.errors.length) return false

  const SocialData = ref({
    facebook: socialData.value.facebook,
    instagram: socialData.value.instagram,
    tiktok: socialData.value.tiktok,
    linkedin: socialData.value.linkedin,
  })

  axios.post(`${settings.backend}/api/profile/update/social-data`, SocialData.value, { withCredentials: true })
    .then((response) => {
      if (response.data.success) {
        toast.add({ severity: 'success', summary: 'Úspech', detail: 'Sociálne siete boli aktualizované.', group: 'br', life: 5000 })
        socialData.value.success = true
        socialData.value.changed = false
        user.value.facebook = socialData.value.facebook
        user.value.instagram = socialData.value.instagram
        user.value.tiktok = socialData.value.tiktok
        user.value.linkedin = socialData.value.linkedin
      } else {
        socialData.value.errors = response.data.errors
        socialData.value.errors.forEach((el: any) => {
          toast.add({ severity: 'error', summary: 'Chyba', detail: el.message, group: 'br', life: 8000 })
        })
      }
      console.log(response)
    })
    .catch((error) => {
      toast.add({ severity: 'error', summary: 'Chyba', detail: error, group: 'br', life: 8000 })
      socialData.value.errors.push({ where: 'error', message: error })
      console.log(error)
    })
    .finally(() => {
      socialData.value.loading = false
      console.log('finally')
    })
}
const getErrorSocialData = (search: any) => {
  const emailError = socialData.value.errors.find((error: any) => error.where === search);
  return emailError ? emailError.message : '';
}
const validURL = (url: string, where: string) => {
  const urlRegex = /^(https?:\/\/)?(www\.)?[\w\.-]+\.[\w\.-]+\/[\w\@:%_\+.~#?&\/\/=\\-]+\/?$/
  if (urlRegex.test(url)) {
    return true
  } else {
    socialData.value.errors.push({where: where, message: 'Nesprávny formát URL.'})
  }
}

onMounted(() => {
  setLoginData()
  setAdvancedData()
  setSocialData()
})

</script>