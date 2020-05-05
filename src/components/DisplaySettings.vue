<template>
    <div class="displaySettings">

        <div class="settings-section__container">
            <div class="settings-section__title">
                <span>User Settings</span>
            </div>
            <div class="settings-section__content" id="edituser">
                <div class="settings-group__container">
                    <div class="settings-group__title">
                        <a href="#edituser">Edit User</a>
                    </div>
                    <div class="settings-group__content">
                        <EditUser />
                    </div>
                </div>

                <div class="settings-group__container" id="useractions">
                    <div class="settings-group__title">
                        <a href="#useractions">User Actions</a>
                    </div>
                    <div class="settings-group__content">
                        <UserActions />
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section__container">
            <div class="settings-section__title">
                <span>User Preferences</span>
            </div>
            <div class="settings-section__content">
                <div class="settings-group__container" id="shadowsettings">

                    <div class="settings-group__title">
                        <a href="#shadowsettings">Map Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <EditMap/>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
    import EditUser from '@/components/SettingsComponents/EditUser';
    import UserActions from '@/components/SettingsComponents/UserActions';
    import EditMap from '@/components/SettingsComponents/EditMap';

    export default {
        name: 'DisplaySettings' ,
        components: { EditMap , UserActions , EditUser }
    };
</script>

<style scoped lang="scss">

    .displaySettings {
        width: 700px;
        margin: 0 2rem;

    }

    .settings-group__container {
        padding: 1rem;
    }

    .settings-group__title {
        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 1.7rem;
        a {
            color: black;
            text-decoration: underline;
        }
    }

    .settings-section__title {
        background: var(--scots-grey1);
        color: white;

        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 2rem;

        padding: 0.75rem;
    }

    .settings-group__content {
        padding: 1rem 0.5rem;
    }
    .settings-section__content {
        padding: 0.5rem;
    }


    @media only screen and (max-width: 1023px) {
        .displaySettings {
            width: 95%;
            margin: 0;
        }

        .settings-group__container {
            padding: 0;
        }
    }
</style>
