package com.bounswe.heka.timeline

import android.graphics.BitmapFactory
import android.opengl.Visibility
import android.os.Bundle
import android.util.Base64
import android.util.Log
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.viewModelScope
import androidx.navigation.findNavController
import androidx.recyclerview.widget.RecyclerView
import com.bounswe.heka.R
import com.bounswe.heka.databinding.TimelineItemBinding
import com.bounswe.heka.network.ApiClient
import com.bounswe.heka.network.SessionManager
import com.bounswe.heka.profile.ProfileState
import com.bumptech.glide.Glide
import com.bumptech.glide.load.engine.DiskCacheStrategy
import kotlinx.coroutines.launch


class TimeLineAdapter(
    private val data: MutableList<TimelineListItemState>,
    val upvote: (String) -> Unit,
    val downvote: (String) -> Unit
) : RecyclerView.Adapter<TimeLineAdapter.TimelineListItemViewHolder>() {

    class TimelineListItemViewHolder(val binding: TimelineItemBinding) :
        RecyclerView.ViewHolder(binding.root) {
        private val sessionManager = SessionManager(binding.root.context)
        private val image = binding.timelineProfileImage
        fun bind(
            state: TimelineListItemState,
            upvote: (String) -> Unit,
            downvote: (String) -> Unit
        ) {
            binding.state = state
            if (state.image == null) {
                binding.timelineImage.visibility = View.GONE
            } else {
                binding.timelineImage.visibility = View.VISIBLE
            }
            Glide.with(binding.root.context)
                .load(state.image)
                .diskCacheStrategy(DiskCacheStrategy.ALL)
                .into(binding.timelineImage)

            Glide.with(binding.root.context)
                .load(state.author_image)
                .placeholder(R.drawable.temp_profile_photo)
                .diskCacheStrategy(DiskCacheStrategy.ALL)
                .into(binding.timelineProfileImage)

            if (state.username != sessionManager.fetchUsername()) {
                binding.timelineEditButton.visibility = android.view.View.GONE
            } else {
                binding.timelineEditButton.visibility = android.view.View.VISIBLE
            }

//            if (state.image == null) {
//                binding.timelineImage.visibility = android.view.View.GONE
//            } else {
//                try {
//                    Glide.with(binding.root.context)
//                        .load(Base64.decode(state.image, Base64.DEFAULT))
//                        .diskCacheStrategy(DiskCacheStrategy.ALL)
//                        .into(binding.timelineImage)
//                }
//                catch (e: Exception) {
//                    binding.timelineImage.visibility = android.view.View.GONE
//                }
//            }

            binding.timelineEditButton.setOnClickListener {
                val bundle = Bundle()
                bundle.putString("slug", state.slug)
                binding.root.findNavController()
                    .navigate(R.id.action_homeFragment_to_editPostFragment, bundle)
            }
            binding.card.setOnClickListener {
                val bundle = Bundle()
                bundle.putString("slug", state.slug)
                bundle.putString("author_image", state.author_image)
                binding.root.findNavController()
                    .navigate(R.id.action_homeFragment_to_fullPostFragment, bundle)
            }
            binding.timelineItemUpvote.text = state.upvote.toString()
            binding.timelineItemDownvote.text = state.downvote.toString()
            binding.timelineItemUpvote.setOnClickListener {
                upvote(state.slug)
            }
            binding.timelineItemDownvote.setOnClickListener {
                downvote(state.slug)
            }
            binding.timelineProfileImage.setOnClickListener {
                val bundle = Bundle()
                bundle.putString("username", state.username)
                binding.root.findNavController()
                    .navigate(R.id.action_homeFragment_to_profileFragment, bundle)
            }
        }
    }

    fun addItems(items: List<TimelineListItemState>) {
        data.clear()
        data.addAll(items)
        notifyDataSetChanged()
    }


    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): TimelineListItemViewHolder {
        val binding =
            TimelineItemBinding.inflate(LayoutInflater.from(parent.context), parent, false)
        return TimelineListItemViewHolder(binding)
    }

    override fun onBindViewHolder(holder: TimelineListItemViewHolder, position: Int) {
        holder.bind(data[position], upvote, downvote)
    }

    override fun getItemCount(): Int {
        return data.size
    }
}