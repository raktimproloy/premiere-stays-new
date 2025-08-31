import SuperAdminLayout from '@/components/layout/SuperAdminLayout'
import Properties from '@/components/admin/properties'
import React from 'react'

export default function page() {
  return (
    <SuperAdminLayout>
        <Properties role="superadmin" />
    </SuperAdminLayout>
  )
}
