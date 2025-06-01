# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Clear existing data to make seeds idempotent
Comment.destroy_all
Post.destroy_all
User.destroy_all

puts "Creating users..."

# Create 10 users
10.times do
  User.create!(
    name: Faker::Name.name,
    email: Faker::Internet.unique.email
  )
end

puts "Created #{User.count} users"

puts "Creating posts..."

# Create 25 posts (2-3 posts per user on average)
25.times do
  Post.create!(
    title: Faker::Lorem.sentence(word_count: 3, supplemental: false, random_words_to_add: 2),
    content: Faker::Lorem.paragraphs(number: 3).join("\n\n"),
    user: User.all.sample
  )
end

puts "Created #{Post.count} posts"

puts "Creating comments..."

# Create 50 comments (2 comments per post on average)
50.times do
  Comment.create!(
    content: Faker::Lorem.paragraph(sentence_count: 2),
    user: User.all.sample,
    post: Post.all.sample
  )
end

puts "Created #{Comment.count} comments"
puts "Seeding completed!"
