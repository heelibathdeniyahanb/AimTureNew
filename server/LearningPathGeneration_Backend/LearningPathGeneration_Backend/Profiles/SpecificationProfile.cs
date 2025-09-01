using LearningPathGeneration_Backend.Migrations;
using LearningPathGeneration_Backend.Dtos;
using LearningPathGeneration_Backend.Models;
using AutoMapper;

namespace LearningPathGeneration_Backend.Profiles
{
    public class SpecificationProfile : Profile
    {
        public SpecificationProfile()
        {
            CreateMap<Models.ProviderSpecifications, SpecificationDto>();
            CreateMap<CreateSpecificationDto, Models.ProviderSpecifications>();
            CreateMap<UpdateSpecificationDto, Models.ProviderSpecifications>();
          

        }
    }
}
