;(function () {
  'use strict'
  const {
    state, content, editorDialog, persist, getPages, isLockedMenuDomain, syncMenuVisibility, getFloatingActionSettings, toast,
    render, saveCollectionEditor,
  } = window.BNVIIT_ADMIN

  function saveEditor(event) {
    event.preventDefault()
    if (!state.currentEditor) return
    const editorForm = document.getElementById('editorForm')
    if (typeof editorForm.checkValidity === 'function' && !editorForm.checkValidity()) {
      editorForm.reportValidity()
      return
    }
    const formData = new FormData(editorForm)
    if (state.currentEditor.mode === 'page') {
      const id = state.currentEditor.id
      const path = String(formData.get('path') || '').trim()
      const publishStart = String(formData.get('publishStart') || '')
      const publishEnd = String(formData.get('publishEnd') || '')
      if (!path.startsWith('/')) {
        toast('페이지 경로는 /로 시작해야 합니다.')
        return
      }
      if (getPages().some((page) => page.id !== id && page.path === path)) {
        toast('이미 사용 중인 페이지 경로입니다.')
        return
      }
      if (publishStart && publishEnd && publishStart > publishEnd) {
        toast('게시 종료일은 시작일 이후로 설정해 주세요.')
        return
      }
      const update = {
        domain: String(formData.get('domain') || ''),
        type: String(formData.get('type') || '정적 콘텐츠'),
        template: String(formData.get('template') || 'content'),
        title: String(formData.get('title') || ''),
        path,
        workflow: String(formData.get('workflow') || 'draft'),
        visible: formData.get('visible') === 'true',
        menuVisible: formData.get('menuVisible') === 'true',
        publishStart,
        publishEnd,
        heading: String(formData.get('heading') || ''),
        description: String(formData.get('description') || ''),
        scr: String(formData.get('scr') || '').split(',').map((item) => item.trim()).filter(Boolean),
        updated: new Date().toISOString().slice(0, 10),
      }
      if (id === 'new') state.customPages.push({ id: `custom-${Date.now()}`, partial: false, ...update })
      else state.pageOverrides[id] = update
    } else if (state.currentEditor.mode === 'seo') {
      const canonical = String(formData.get('canonical') || '')
      if (canonical && !/^https:\/\//.test(canonical)) {
        toast('Canonical URL은 https:// 주소로 입력해 주세요.')
        return
      }
      state.seoOverrides[state.currentEditor.id] = {
        title: String(formData.get('seoTitle') || ''),
        description: String(formData.get('seoDescription') || ''),
        canonical,
        ogType: String(formData.get('ogType') || 'website'),
        ogTitle: String(formData.get('ogTitle') || ''),
        ogDescription: String(formData.get('ogDescription') || ''),
        indexRule: String(formData.get('indexRule') || 'index, follow'),
        ogImage: String(formData.get('ogImage') || ''),
        updated: new Date().toISOString().slice(0, 10),
      }
    } else if (state.currentEditor.mode === 'common-item') {
      const row = [
        String(formData.get('name') || ''),
        String(formData.get('scope') || ''),
        String(formData.get('items') || ''),
        String(formData.get('status') || '운영'),
        String(formData.get('scr') || '').split(',').map((item) => item.trim()).filter(Boolean),
      ]
      if (state.currentEditor.index === 'new') state.moduleRows['common-layout'].push(row)
      else state.moduleRows['common-layout'][Number(state.currentEditor.index)] = row
    } else if (state.currentEditor.mode === 'media') {
      const id = state.currentEditor.id
      const existing = state.mediaAssets.find((item) => item.id === id) || {}
      const upload = formData.get('upload')
      const uploadedName = upload && typeof upload.name === 'string' ? upload.name : ''
      const uploadedSize = upload && Number(upload.size) > 0 ? `${Math.max(1, Math.round(Number(upload.size) / 1024))} KB` : ''
      const update = {
        ...existing,
        id: id === 'new' ? `media-${Date.now()}` : id,
        name: String(formData.get('name') || ''),
        category: String(formData.get('category') || '기타'),
        fileName: uploadedName || String(formData.get('fileName') || ''),
        fileType: String(formData.get('fileType') || '').toUpperCase(),
        size: uploadedSize || String(formData.get('size') || ''),
        dimensions: String(formData.get('dimensions') || ''),
        alt: String(formData.get('alt') || ''),
        usage: String(formData.get('usage') || ''),
        url: String(formData.get('url') || ''),
        status: String(formData.get('status') || 'draft'),
        updated: new Date().toISOString().slice(0, 10),
      }
      if (id === 'new') state.mediaAssets.push(update)
      else state.mediaAssets = state.mediaAssets.map((item) => item.id === id ? update : item)
    } else if (state.currentEditor.mode === 'home-item') {
      const { sectionId, id } = state.currentEditor
      const items = state.homeContent[sectionId]
      const existing = items.find((item) => item.id === id) || {}
      const itemId = id === 'new' ? `${sectionId}-${Date.now()}` : id
      const startsAt = String(formData.get('startsAt') || '')
      const endsAt = String(formData.get('endsAt') || '')
      if (startsAt && endsAt && startsAt > endsAt) {
        toast('노출 종료일은 시작일 이후로 설정해 주세요.')
        return
      }
      let update
      if (sectionId === 'hero') {
        update = {
          ...existing,
          id: itemId,
          eyebrow: String(formData.get('eyebrow') || ''),
          title: String(formData.get('title') || ''),
          description: String(formData.get('description') || ''),
          mediaType: String(formData.get('mediaType') || 'image'),
          mediaUrl: String(formData.get('mediaUrl') || ''),
          primaryLabel: String(formData.get('primaryLabel') || ''),
          primaryRoute: String(formData.get('primaryRoute') || ''),
          secondaryLabel: String(formData.get('secondaryLabel') || ''),
          secondaryRoute: String(formData.get('secondaryRoute') || ''),
          theme: String(formData.get('theme') || 'blue'),
          startsAt,
          endsAt,
          visible: formData.get('visible') === 'true',
        }
      } else if (sectionId === 'quick') {
        update = {
          ...existing,
          id: itemId,
          title: String(formData.get('title') || ''),
          description: String(formData.get('description') || ''),
          route: String(formData.get('route') || ''),
          icon: String(formData.get('icon') || 'link'),
          tone: String(formData.get('tone') || 'blue'),
          visible: formData.get('visible') === 'true',
        }
      } else if (sectionId === 'ticker') {
        update = {
          ...existing,
          id: itemId,
          kind: String(formData.get('kind') || 'notice'),
          label: String(formData.get('label') || ''),
          title: String(formData.get('title') || ''),
          actionLabel: String(formData.get('actionLabel') || ''),
          route: String(formData.get('route') || ''),
          tone: String(formData.get('tone') || 'gray'),
          startsAt,
          endsAt,
          visible: formData.get('visible') === 'true',
        }
      } else {
        update = {
          ...existing,
          id: itemId,
          kind: String(formData.get('kind') || 'link'),
          title: String(formData.get('title') || ''),
          description: String(formData.get('description') || ''),
          route: String(formData.get('route') || ''),
          tone: String(formData.get('tone') || 'blue'),
          phone: String(formData.get('phone') || ''),
          note: String(formData.get('note') || ''),
          visible: formData.get('visible') === 'true',
        }
      }
      if (id === 'new') items.push(update)
      else state.homeContent[sectionId] = items.map((item) => item.id === id ? update : item)
    } else if (state.currentEditor.mode === 'menu-domain') {
      if (state.currentEditor.domainIndex !== 'new' && isLockedMenuDomain(state.menuDomains[Number(state.currentEditor.domainIndex)])) {
        toast('홈 대메뉴는 수정할 수 없습니다.')
        return
      }
      const path = String(formData.get('path') || '').trim()
      if (!path.startsWith('/') && !/^https:\/\//.test(path)) {
        toast('메뉴 경로는 / 또는 https://로 시작해야 합니다.')
        return
      }
      const name = String(formData.get('name') || '').trim()
      const duplicate = state.menuDomains.some((domain, index) => index !== Number(state.currentEditor.domainIndex) && (domain.name === name || domain.path === path))
      if (duplicate) {
        toast('같은 이름 또는 경로의 대메뉴가 이미 있습니다.')
        return
      }
      const update = {
        name,
        path,
        status: String(formData.get('status') || 'draft'),
        target: String(formData.get('target') || '_self'),
        badge: String(formData.get('badge') || ''),
        auth: String(formData.get('auth') || 'all'),
      }
      if (state.currentEditor.domainIndex === 'new') state.menuDomains.push({ ...update, id: `domain-${Date.now().toString(36)}-${state.menuDomains.length}`, children: [] })
      else state.menuDomains[Number(state.currentEditor.domainIndex)] = { ...state.menuDomains[Number(state.currentEditor.domainIndex)], ...update }
    } else if (state.currentEditor.mode === 'menu-child') {
      const children = state.menuDomains[Number(state.currentEditor.domainIndex)].children
      const path = String(formData.get('path') || '').trim()
      if (!path.startsWith('/') && !/^https:\/\//.test(path)) {
        toast('메뉴 경로는 / 또는 https://로 시작해야 합니다.')
        return
      }
      const update = {
        title: String(formData.get('name') || ''),
        path,
        status: String(formData.get('status') || 'draft'),
        target: String(formData.get('target') || '_self'),
        badge: String(formData.get('badge') || ''),
        auth: String(formData.get('auth') || 'all'),
      }
      if (state.currentEditor.childIndex === 'new') children.push({ ...update, id: `menu-${Date.now().toString(36)}-${children.length}` })
      else children[Number(state.currentEditor.childIndex)] = { ...children[Number(state.currentEditor.childIndex)], ...update }
    } else if (state.currentEditor.mode === 'language-pack') {
      const packId = state.currentEditor.id
      const existing = state.languagePacks.find((entry) => entry.id === packId)
      const countryCode = String(formData.get('languageCountryCode') || '').trim().toLowerCase()
      const country = String(formData.get('languageCountry') || '').trim()
      const locale = String(formData.get('languageLocale') || '').trim()
      if (!/^[a-z]{2}$/.test(countryCode) || !country) {
        toast('국기와 국가를 선택해 주세요.')
        return
      }
      if (!/^[a-z]{2,3}(?:-[A-Za-z]{2,4})?$/.test(locale)) {
        toast('Locale 코드는 ko, en, zh-CN 같은 형식으로 입력해 주세요.')
        return
      }
      if (state.languagePacks.some((entry) => entry.id !== packId && entry.locale.toLowerCase() === locale.toLowerCase())) {
        toast('이미 등록된 Locale 코드입니다.')
        return
      }
      const update = {
        countryCode,
        country,
        name: String(formData.get('languageName') || '').trim(),
        locale,
        displayCode: String(formData.get('languageDisplayCode') || '').trim().toUpperCase(),
        scope: String(formData.get('languageScope') || '').trim(),
        enabled: String(formData.get('languageEnabled')) === 'true',
      }
      if (packId === 'new') {
        const baseId = locale.toLowerCase().replace(/[^a-z0-9]+/g, '-')
        let id = baseId
        let suffix = 2
        while (state.languagePacks.some((entry) => entry.id === id)) id = `${baseId}-${suffix++}`
        state.languagePacks.push({ id, ...update, base: false })
        if (state.currentEditor.source === 'floating-actions') {
          state.floatingLocale = id
          getFloatingActionSettings(id)
        }
      } else if (existing) {
        Object.assign(existing, update, existing.base ? { enabled: true, locale: existing.locale } : {})
      }
      syncMenuVisibility()
    } else if (state.currentEditor.mode === 'floating-channel') {
      const settings = getFloatingActionSettings(state.currentEditor.localeId)
      if (!Array.isArray(settings.custom)) settings.custom = []
      const color = String(formData.get('floatingChannelColor') || '#667085')
      settings.custom.push({
        id: `channel-${Date.now().toString(36)}-${settings.custom.length + 1}`,
        icon: String(formData.get('floatingChannelType') || 'message'),
        label: String(formData.get('floatingChannelLabel') || '').trim(),
        target: String(formData.get('floatingChannelTarget') || '').trim(),
        color: /^#[0-9a-f]{6}$/i.test(color) ? color : '#667085',
        visible: String(formData.get('floatingChannelVisible')) === 'true',
      })
    } else if (state.currentEditor.mode === 'module' || state.currentEditor.mode === 'module-new') {
      const module = state.currentEditor.module
      const values = [0, 1, 2, 3, 4].map((index) => String(formData.get(`field-${index}`) || ''))
      values[4] = values[4].split(',').map((item) => item.trim()).filter(Boolean)
      if (state.currentEditor.mode === 'module-new') state.moduleRows[module].push(values)
      else state.moduleRows[module][state.currentEditor.index] = values
    } else if (state.currentEditor.mode === 'collection') {
      saveCollectionEditor(formData)
    }
    persist()
    editorDialog.close()
    toast('변경사항을 프로토타입 저장소에 반영했습니다.')
    render()
  }

  Object.assign(window.BNVIIT_ADMIN, { saveEditor })
})()
