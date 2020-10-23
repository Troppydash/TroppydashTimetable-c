<template>
    <div>
        <a href="#" @click="toggleModal">Mentions</a>
        <CustomModel title="Mentions" :is-showing="showModal" :on-cancel="toggleModal" :on-complete="toggleModal">
            <div v-for="loadingMessage in messages" :key="loadingMessage.suggestedPerson">
                <h3>{{ person(loadingMessage.suggestedPerson) }}</h3>
                <p v-for="message in loadingMessage.messages" :key="message">
                    {{ message }}
                </p>
            </div>
        </CustomModel>
    </div>
</template>

<script>
    import CustomModel from '@/components/Popups/CustomModel';
    import { messages , QuotePerson } from '@/service/loadingMessage';
    export default {
        name: 'LoadingMessages',
        components: { CustomModel } ,
        data() {
            return {
                showModal: false,
                messages
            }
        },
        computed: {

        },
        methods: {
            toggleModal() {
                this.showModal = !this.showModal;
            },
            person(suggestedPerson) {
                return QuotePerson[suggestedPerson].toString();
            }
        }
    };
</script>

<style scoped>

</style>
