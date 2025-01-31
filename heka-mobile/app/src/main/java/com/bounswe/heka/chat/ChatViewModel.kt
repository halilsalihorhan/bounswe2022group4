package com.bounswe.heka.chat

import androidx.lifecycle.*
import com.bounswe.heka.data.chat.FetchMessageRequest
import com.bounswe.heka.data.chat.Message
import com.bounswe.heka.data.chat.SendMessageRequest
import com.bounswe.heka.data.chat.UserInfo
import com.bounswe.heka.network.ApiClient
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import javax.inject.Inject
import kotlin.random.Random

@HiltViewModel
class ChatViewModel @Inject constructor(): ViewModel() {
    val otherUser: MutableLiveData<UserInfo> = MutableLiveData()
    val messagesList = MutableLiveData<MutableList<Message>>()
    val newMessageText = MutableLiveData<String>()
    var job: Job? = null

    private fun fetchMessages() {
        viewModelScope.launch {
            try {
                otherUser.value?.let {
                    ApiClient.get().fetchMessage(FetchMessageRequest(otherUser.value!!.displayName)).let {
                        messagesList.value = it.map { message ->
                            Message(
                                message.sender,
                                message.message,
                                9,
                                true
                            )
                        }.toMutableList()
                    }
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    fun sendMessage() {
        viewModelScope.launch {
            try {
                otherUser.value?.let {
                    ApiClient.get().sendMessage(
                        SendMessageRequest(
                            otherUser.value!!.displayName,
                            newMessageText.value!!
                        )
                    )
                }
                newMessageText.value = ""
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
    override fun onCleared() {
        super.onCleared()
        job?.cancel()
    }
    fun initMessages() {
        job = viewModelScope.launch {
            while (true) {
                fetchMessages()
                delay(1000)
            }
        }
    }


}