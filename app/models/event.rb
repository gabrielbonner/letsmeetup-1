# Event for users to attend
class Event < ApplicationRecord
  extend FriendlyId
  friendly_id :name, use: :slugged

  validates :name, presence: true
  validates :duration_minutes, presence: true

  belongs_to :location
  has_many :events_users, dependent: :destroy
  has_many :users, through: :events_users
  has_many :timeslots, dependent: :destroy
end