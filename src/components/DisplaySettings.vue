<template>
    <div class="displaySettings">

        <div class="settings-section__container">
            <div class="settings-section__title">
                <span>User Settings</span>
            </div>
            <div class="settings-section__content" id="edituser">
                <div class="settings-group__container">
                    <div class="settings-group__title">
                        <a href="#edituser">
                            Edit User
                        </a>
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
                <div class="settings-group__container" id="mapsettings">
                    <div class="settings-group__title">
                        <a href="#mapsettings">Map Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <EditMap/>
                    </div>
                </div>
                <div class="settings-group__container" id="tablesettings">
                    <div class="settings-group__title">
                        <a href="#tablesettings">Table Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <EditTable/>
                    </div>
                </div>
            </div>
        </div>


        <div class="settings-section__container">
            <div class="settings-section__title">
                <span>Beta Settings</span>
            </div>
            <div class="settings-section__content">
                <div class="settings-group__container" id="betamapsettings">
                    <div class="settings-group__title">
                        <a href="#betamapsettings">Beta Map Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <MapSettings />
                    </div>
                </div>
                <div class="settings-group__container" id="betatablesettings">
                    <div class="settings-group__title">
                        <a href="#betatablesettings">Beta Table Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <!--<EditTable/>-->
                    </div>
                </div>
                <div class="settings-group__container" id="betawebsitesettings">
                    <div class="settings-group__title">
                        <a href="#betawebsitesettings">Beta Website Settings</a>
                    </div>
                    <div class="settings-group__content">
                        <WebsiteSettings />
                    </div>
                </div>
            </div>
        </div>

        <div class="settings-section__container">
            <div class="settings-section__title">
                <span>About</span>
            </div>
            <div class="settings-section__content">
                <div class="settings-group__container" id="aboutstimetable">
                    <div class="settings-group__title">
                        <a href="#aboutstimetable">About STimetable</a>
                    </div>
                    <div class="settings-group__content">
                        <p>Made by the Roppys</p>
                        <p>Compiled 16/10/20</p>
                    </div>
                </div>
            </div>
            <div class="settings-section__content">
                <div class="settings-group__container" id="pastcommits">
                    <div class="settings-group__title">
                        <a href="#pastcommits">Past Commits</a>
                    </div>
                    <div class="settings-group__content">
                        <PastCommits />
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
    import EditTable from '@/components/SettingsComponents/EditTable';
    import PastCommits from '@/components/SettingsComponents/PastCommits';
    import MapSettings from '@/components/SettingsComponents/MapSettings';
    import WebsiteSettings from '@/components/SettingsComponents/WebsiteSettings';

    export default {
        name: 'DisplaySettings' ,
        components: { WebsiteSettings , MapSettings , PastCommits , EditTable , EditMap , UserActions , EditUser }
    };
</script>

<style scoped lang="scss">

    .displaySettings {
        width: 700px;
        margin: 0 2rem;
        transition: all 0.15s ease-in-out;
    }

    .settings-group__container {
        padding: 1rem;
    }

    .settings-group__title {
        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 1.5rem;
        a {
            color: black;
            text-decoration: underline;
        }
    }

    .settings-section__title {
        background: var(--scots-grey2);
        color: white;

        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 1.75rem;

        padding: 0.75rem;
    }

    .settings-group__content {
        padding: 1rem 0.5rem;
    }
    .settings-section__content {
        padding: 0.5rem;
    }


    @media only screen and (max-width: 1200px) {
        .displaySettings {
            width: 600px;
            margin: 0 0.5rem;
        }
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
