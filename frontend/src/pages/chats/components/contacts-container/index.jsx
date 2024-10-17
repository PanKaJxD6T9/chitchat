import Logo from '@/components/Logo';
import Title from '@/components/Title';
import React, { useEffect } from 'react'
import ProfileInfo from './components/profile-info';
import NewDM from './components/new-directMessage';
import { apiClient } from '@/lib/api-client';
import { GET_DM_CONTACTS_ROUTE } from '@/utils/constants';
import { useAppStore } from '@/store';
import ContactList from '@/components/Contact-List';

const ContactsContainer = () => {

    const {setDirectMessagesContacts, directMessagesContacts} = useAppStore();

    useEffect(()=>{
        const getContacts = async()=>{
            const response = await apiClient.get(GET_DM_CONTACTS_ROUTE, {withCredentials: true});
            if(response.data.contacts){
                setDirectMessagesContacts(response.data.contacts);
            }
        }

        getContacts();

    }, [])

  return (
    <div className='relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-[#1b1c24] border-r-2 border-[#2f303b] w-full'>
        <div className="pt-3 ">
            <Logo />
        </div>
        <div className="my-5">
            <div className="flex items-center justify-between pr-10">
                <Title text={"Direct Messages"}/>
                <NewDM />
            </div>
            <div className="max-h-[38vh] overflow-y-auto scrollbar-hidden">
                <ContactList contacts={directMessagesContacts} />
            </div>
        </div>
        <ProfileInfo />
    </div>
  )
}

export default ContactsContainer;