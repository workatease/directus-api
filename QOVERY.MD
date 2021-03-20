### INSTALLATION STEPS

Fork this git repo
and add it to the Qovery

set the environment value via cli

# below values are taken from the in $ is taken from the qovery values

qovery project env add DB_CLIENT 'pg' -p Agrigates
qovery project env add DB_HOST '$QOVERY_DATABASE_DIRECTUS_HOST' -p Agrigates
qovery project env add DB_PORT '$QOVERY_DATABASE_DIRECTUS_PORTQOVERY_DATABASE_DIRECTUS_PORT' -p Agrigates
qovery project env add DB_DATABASE '$QOVERY_DATABASE_DIRECTUS_DATABASEQOVERY_DATABASE_DIRECTUS_DATABASE' -p Agrigates
qovery project env add DB_USER '$QOVERY_DATABASE_DIRECTUS_USERNAMEQOVERY_DATABASE_DIRECTUS_USERNAME' -p Agrigates
qovery project env add DB_PASSWORD '$QOVERY_DATABASE_DIRECTUS_PASSWORD' -p Agrigates
qovery project env add PUBLIC_URL '$QOVERY_ROUTER_MAIN_DIRECTUS_API_URLQOVERY_ROUTER_MAIN_DIRECTUS_API_URL' -p Agrigates

# below values has to be according to your mount

qovery project env add STORAGE_LOCATIONS 'local' -p Agrigates
qovery project env add STORAGE_LOCAL_PUBLIC_URL '/uploads' -p Agrigates
qovery project env add STORAGE_LOCAL_DRIVER 'local' -p Agrigates
qovery project env add STORAGE_LOCAL_ROOT '/mnt/upload' -p Agrigates

# below values has to be unique to your site

qovery project env add KEY "63c5f9d4-010c-4204-b90a-f6f1d0f9a07b" -p Agrigates
qovery project env add SECRET "AjOEWL_jfYgbRH1C5oFvJpRu_1lkpQ0X" -p Agrigates

qovery project env add NPM_CONFIG_LOGLEVEL verbose -p Agrigates
