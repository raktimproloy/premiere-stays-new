import SuperAdminLayout from '@/components/layout/SuperAdminLayout'
import Profile from '@/components/admin/profile'
import React from 'react'

export default function page() {
  return (
    <SuperAdminLayout>
        <Profile role="superadmin" />
    </SuperAdminLayout>
  )
}
