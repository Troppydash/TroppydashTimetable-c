<template>
    <div class="displaySettingsSidebar" v-if="!isMobile">
        <div class="section" v-for="(section, index) in this.menuInfo" :key="index">
            <div class="main-header">
                <span>{{ section.heading }}</span>
            </div>
            <div class="sub-header" v-for="(subHeading, index) in section.subHeadings" :key="index">
                <a :href="'#'+subHeading.split(' ').join('').toLowerCase()">{{ subHeading }}</a>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'DisplaySettingsSidebar' ,
        props: ['isMobile'] ,
        data() {
            return {
                menuInfo: []
            };
        } ,
        methods: {
            setInfo() {
                const info = [];
                document.getElementsByClassName('settings-section__container').forEach(section => {
                    const current = {};
                    current.heading = section.getElementsByClassName('settings-section__title')[0].children[0].innerText;
                    current.subHeadings = [];

                    section.getElementsByClassName('settings-group__container').forEach(subHeading => {
                        current.subHeadings.push(subHeading.getElementsByClassName('settings-group__title')[0].children[0].innerText);
                    });
                    info.push(current);
                });
                this.menuInfo = info;
            }
        },
        mounted() {
            this.setInfo();
        }
    };
</script>

<style scoped lang="scss">

    .displaySettingsSidebar {
        width: 300px;
        align-self: flex-start;
        position: -webkit-sticky;
        position: sticky;
        top: 50px;

        background: var(--scots-lightgrey);

        margin: 0 2rem;

    }

    .section {

    }

    .sub-header {
        font-family: "Roboto Light", Sans, sans-serif;
        padding: 0.75rem;

        font-size: 1.25rem;

        a {
            color: black;
            text-decoration: underline;
        }
    }

    .main-header {
        background: var(--scots-grey1);
        color: white;

        font-family: "Roboto Light", Sans, sans-serif;
        font-size: 1.5rem;

        padding: 0.75rem;
    }

</style>
